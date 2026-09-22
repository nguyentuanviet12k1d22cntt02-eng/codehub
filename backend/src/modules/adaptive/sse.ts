export async function consumeSse(body: ReadableStream<Uint8Array>, onEvent: (event:any)=>Promise<void>) {
    const reader=body.getReader(), decoder=new TextDecoder();
    let buffer='';
    const consume=async(block:string)=>{
        const data=block.split('\n').filter(line=>line.startsWith('data:')).map(line=>line.slice(5).trimStart()).join('\n');
        if(data) await onEvent(JSON.parse(data));
    };
    try {
        while(true) {
            const {value,done}=await reader.read();
            if(done) break;
            buffer+=(decoder.decode(value,{stream:true}));
            buffer=buffer.replace(/\r\n/g,'\n');
            let boundary:number;
            while((boundary=buffer.indexOf('\n\n'))>=0) {
                const block=buffer.slice(0,boundary);buffer=buffer.slice(boundary+2);
                await consume(block);
            }
        }
        buffer+=decoder.decode();
        if(buffer.trim()) await consume(buffer);
    } finally { reader.releaseLock(); }
}
