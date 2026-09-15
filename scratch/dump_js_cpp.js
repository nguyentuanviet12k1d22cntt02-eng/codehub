
const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config({ path: 'd:/Project/LearnPython/backend/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function dumpData() {
    const client = await pool.connect();
    try {
        const coursesRes = await client.query(`
            SELECT id, title, description, level 
            FROM courses 
            WHERE title ILIKE '%c++%' OR title ILIKE '%javascript%' OR title ILIKE '%js%'
            ORDER BY created_at ASC
        `);

        const result = { courses: [] };

        for (const c of coursesRes.rows) {
            const courseObj = {
                id: c.id,
                title: c.title,
                description: c.description,
                level: c.level,
                modules: []
            };

            const modsRes = await client.query(`
                SELECT id, module_id, title, objective, key_knowledge, prerequisite, skills_acquired, duration, order_index 
                FROM modules 
                WHERE course_id = $1 
                ORDER BY order_index ASC
            `, [c.id]);

            for (const m of modsRes.rows) {
                const modObj = {
                    id: m.id,
                    moduleId: m.module_id,
                    title: m.title,
                    objective: m.objective,
                    keyKnowledge: m.key_knowledge,
                    prerequisite: m.prerequisite,
                    skillsAcquired: m.skills_acquired,
                    duration: m.duration,
                    orderIndex: m.order_index,
                    chapters: []
                };

                const chsRes = await client.query(`
                    SELECT id, chapter_id, title, objective, core_knowledge, skills_acquired, order_index 
                    FROM chapters 
                    WHERE module_id = $1 
                    ORDER BY order_index ASC
                `, [m.id]);

                for (const ch of chsRes.rows) {
                    const chObj = {
                        id: ch.id,
                        chapterId: ch.chapter_id,
                        title: ch.title,
                        objective: ch.objective,
                        coreKnowledge: ch.core_knowledge,
                        skillsAcquired: ch.skills_acquired,
                        orderIndex: ch.order_index,
                        lessons: []
                    };

                    const lRes = await client.query(`
                        SELECT id, lesson_id, title, objective, key_knowledge, difficulty, duration_minutes, order_index 
                        FROM lessons 
                        WHERE chapter_id = $1 
                        ORDER BY order_index ASC
                    `, [ch.id]);

                    chObj.lessons = lRes.rows.map(l => ({
                        id: l.id,
                        lessonId: l.lesson_id,
                        title: l.title,
                        objective: l.objective,
                        keyKnowledge: l.key_knowledge,
                        difficulty: l.difficulty,
                        durationMinutes: l.duration_minutes,
                        orderIndex: l.order_index
                    }));

                    modObj.chapters.push(chObj);
                }
                courseObj.modules.push(modObj);
            }
            result.courses.push(courseObj);
        }

        fs.writeFileSync('scratch/js_cpp_curriculum_dump.json', JSON.stringify(result, null, 2), 'utf8');
        console.log('Dumped curriculum data to scratch/js_cpp_curriculum_dump.json');
    } finally {
        client.release();
        await pool.end();
    }
}

dumpData().catch(e => {
    console.error(e);
    process.exit(1);
});
