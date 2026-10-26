param([string]$Workspace = 'D:\Project\LearnPython')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
public static class RabbitFrames {
    static Graphics Canvas(Bitmap image) {
        var g = Graphics.FromImage(image);
        g.CompositingMode = CompositingMode.SourceOver;
        g.CompositingQuality = CompositingQuality.HighQuality;
        g.InterpolationMode = InterpolationMode.HighQualityBicubic;
        g.PixelOffsetMode = PixelOffsetMode.HighQuality;
        g.SmoothingMode = SmoothingMode.AntiAlias;
        return g;
    }
    static Bitmap NewImage() { return new Bitmap(576, 768, PixelFormat.Format32bppArgb); }
    static void Save(Bitmap bitmap, string path) { bitmap.Save(path, ImageFormat.Png); }
    static void Web(Bitmap bitmap, string path) {
        using(var small = new Bitmap(192,256,PixelFormat.Format32bppArgb)) {
            using(var g=Canvas(small)) g.DrawImage(bitmap, new Rectangle(0,0,192,256));
            Save(small,path);
        }
    }
    public static void Build(string root) {
        string folder=Path.Combine(root,"assets","img","rabbit-mascot");
        string frames=Path.Combine(folder,"frames");
        string layers=Path.Combine(folder,"layers");
        string web=Path.Combine(root,"frontend","public","mascots","rabbit","v1");
        Directory.CreateDirectory(frames); Directory.CreateDirectory(layers); Directory.CreateDirectory(web);
        string[] directions={"n","ne","e","se","s","sw","w","nw"};
        // Registration points are the fur/neck V, not the changing head bbox.
        PointF[] necks={new PointF(520,883),new PointF(610,873),new PointF(590,858),new PointF(520,900),
            new PointF(525,910),new PointF(590,905),new PointF(520,867),new PointF(500,846)};
        float[][] edges={
            new float[]{0,820,300,820,400,830,520,883,650,830,800,810,1024,810},
            new float[]{0,790,300,790,480,820,610,873,760,810,900,740,1024,740},
            new float[]{0,790,340,805,480,810,590,858,720,800,940,770,1024,770},
            new float[]{0,800,300,820,520,900,720,860,1024,800},
            new float[]{0,840,320,860,525,910,730,860,1024,840},
            new float[]{0,820,300,850,420,880,590,905,700,850,1024,800},
            new float[]{0,760,300,810,400,815,520,867,650,820,850,790,1024,790},
            new float[]{0,730,300,800,400,810,500,846,650,800,820,730,1024,730}
        };
        using(var body=NewImage()) {
            using(var original=new Bitmap(Path.Combine(folder,"n-enhanced.png")))
            using(var g=Canvas(body))
            using(var path=new GraphicsPath()) {
                path.AddPolygon(new PointF[]{new PointF(0,430),new PointF(190,430),new PointF(212,418),new PointF(232,415),
                    new PointF(292,441.5f),new PointF(357,415),new PointF(380,418),new PointF(400,430),new PointF(576,430),
                    new PointF(576,768),new PointF(0,768)});
                g.SetClip(path);
                g.DrawImage(original,new Rectangle(32,0,512,768));
            }
            Save(body,Path.Combine(layers,"body.png")); Web(body,Path.Combine(web,"body.png"));
            using(var proof=new Bitmap(1152,960,PixelFormat.Format32bppArgb)) {
                using(var pg=Canvas(proof)) {
                    pg.Clear(Color.FromArgb(242,246,251));
                    for(int index=0;index<directions.Length;index++) {
                        using(var raw=new Bitmap(Path.Combine(folder,directions[index]+"-enhanced.png")))
                        using(var head=NewImage()) {
                            using(var hg=Canvas(head))
                            using(var path=new GraphicsPath()) {
                                float dx=292-necks[index].X*.5f, dy=441.5f-necks[index].Y*.5f;
                                var boundary=edges[index];
                                PointF[] points=new PointF[boundary.Length/2+2];
                                points[0]=new PointF(dx,dy); points[1]=new PointF(dx+512,dy);
                                for(int p=0;p<boundary.Length/2;p++) {
                                    int source=boundary.Length/2-1-p;
                                    points[p+2]=new PointF(dx+boundary[source*2]*.5f,dy+boundary[source*2+1]*.5f);
                                }
                                path.AddPolygon(points); hg.SetClip(path);
                                hg.DrawImage(raw,new RectangleF(dx,dy,512,768));
                            }
                            Save(head,Path.Combine(layers,"head-"+directions[index]+".png"));
                            Web(head,Path.Combine(web,"head-"+directions[index]+".png"));
                            using(var full=NewImage()) {
                                using(var fg=Canvas(full)) { fg.DrawImageUnscaled(body,0,0); fg.DrawImageUnscaled(head,0,0); }
                                Save(full,Path.Combine(frames,directions[index]+".png"));
                                pg.DrawImage(full,new Rectangle((index%4)*288,(index/4)*480+24,288,384));
                                using(var font=new Font("Arial",18,FontStyle.Bold))
                                    pg.DrawString(directions[index].ToUpper(),font,Brushes.DarkSlateGray,(index%4)*288+16,(index/4)*480+425);
                            }
                        }
                    }
                }
                Save(proof,Path.Combine(folder,"contact-sheet.png"));
            }
        }
    }
}
'@
[RabbitFrames]::Build($Workspace)
Write-Output 'Aligned full PNGs and fixed-body/head layers exported. Source images preserved.'
