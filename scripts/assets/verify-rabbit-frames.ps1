param([string]$Workspace = 'D:\Project\LearnPython')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
using System.IO;
public static class VerifyRabbitFrames {
    public static string Check(string root) {
        var folder=Path.Combine(root,"assets","img","rabbit-mascot","frames");
        string[] directions={"n","ne","e","se","s","sw","w","nw"};
        int mismatchedBodyPixels=0, clippedPixels=0;
        long transparent=0, opaque=0, partial=0;
        using(var reference=new Bitmap(Path.Combine(folder,"n.png"))) {
            foreach(var direction in directions) using(var image=new Bitmap(Path.Combine(folder,direction+".png"))) {
                if(image.Width!=576 || image.Height!=768) throw new Exception("Frame dimensions differ");
                for(int y=0;y<768;y++) for(int x=0;x<576;x++) {
                    var pixel=image.GetPixel(x,y);
                    if(pixel.A==0) transparent++; else if(pixel.A==255) opaque++; else partial++;
                    if((x==0 || y==0 || x==575 || y==767) && pixel.A!=0) clippedPixels++;
                    if(y>=470 && pixel.ToArgb()!=reference.GetPixel(x,y).ToArgb()) mismatchedBodyPixels++;
                }
            }
        }
        if(mismatchedBodyPixels!=0 || clippedPixels!=0 || transparent==0 || opaque==0 || partial==0)
            throw new Exception("Asset validation failed: body="+mismatchedBodyPixels+", clipped="+clippedPixels);
        return "{\"status\":\"PASSED\",\"frames\":8,\"width\":576,\"height\":768,"+
            "\"fixed_body_mismatched_pixels\":"+mismatchedBodyPixels+",\"clipped_edge_pixels\":"+clippedPixels+
            ",\"transparent_pixels\":"+transparent+",\"opaque_pixels\":"+opaque+",\"antialiased_pixels\":"+partial+"}";
    }
}
'@
[VerifyRabbitFrames]::Check($Workspace)
