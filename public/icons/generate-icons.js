const fs=require("fs"),path=require("path"),zlib=require("zlib");
const sizes=[72,96,128,144,152,192,384,512];
const outDir=path.join(__dirname,"public","icons");
if(!fs.existsSync(outDir))fs.mkdirSync(outDir,{recursive:true});

const CRC=new Uint32Array(256);
for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;CRC[n]=c;}
function crc32(b){let c=0xffffffff;for(const x of b)c=CRC[(c^x)&0xff]^(c>>>8);return(c^0xffffffff)>>>0;}
function u32(n){return Buffer.from([(n>>>24)&0xff,(n>>>16)&0xff,(n>>>8)&0xff,n&0xff]);}
function chunk(t,d){const tb=Buffer.from(t,"ascii");const cc=crc32(Buffer.concat([tb,d]));return Buffer.concat([u32(d.length),tb,d,u32(cc)]);}

function blend(base, r,g,b,a){
  const alpha=a/255, inv=1-alpha;
  return [Math.round(base[0]*inv+r*alpha), Math.round(base[1]*inv+g*alpha), Math.round(base[2]*inv+b*alpha)];
}

function makePNG(S){
  // Start with RGBA buffer
  const px=new Uint8Array(S*S*4);

  function getBG(x,y){
    const t=((x/S)+(y/S))/2;
    return [Math.round(0x28+(0x48-0x28)*t), Math.round(0x50+(0x70-0x50)*t), Math.round(0x22+(0x36-0x22)*t)];
  }

  // Init background
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){
    const [r,g,b]=getBG(x,y);
    const i=(y*S+x)*4; px[i]=r;px[i+1]=g;px[i+2]=b;px[i+3]=255;
  }

  function setBlend(x,y,r,g,b,a){
    if(x<0||x>=S||y<0||y>=S)return;
    const i=(y*S+x)*4;
    if(px[i+3]===0)return;
    const al=a/255,inv=1-al;
    px[i]=Math.round(px[i]*inv+r*al);
    px[i+1]=Math.round(px[i+1]*inv+g*al);
    px[i+2]=Math.round(px[i+2]*inv+b*al);
    px[i+3]=255;
  }

  function setAlpha(x,y,a){if(x<0||x>=S||y<0||y>=S)return;px[(y*S+x)*4+3]=a;}
  function dot(cx,cy,rad,r,g,b,a){for(let dy=-rad;dy<=rad;dy++)for(let dx=-rad;dx<=rad;dx++)if(dx*dx+dy*dy<=rad*rad)setBlend(cx+dx,cy+dy,r,g,b,a);}
  function rectB(x,y,w,h,r,g,b,a){for(let dy=0;dy<h;dy++)for(let dx=0;dx<w;dx++)setBlend(x+dx,y+dy,r,g,b,a);}

  // Rounded corners = transparent
  const cr=Math.round(S*0.22);
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){
    let out=false;
    if(x<cr&&y<cr)out=Math.hypot(x-cr,y-cr)>cr;
    else if(x>S-cr&&y<cr)out=Math.hypot(x-(S-cr),y-cr)>cr;
    else if(x<cr&&y>S-cr)out=Math.hypot(x-cr,y-(S-cr))>cr;
    else if(x>S-cr&&y>S-cr)out=Math.hypot(x-(S-cr),y-(S-cr))>cr;
    if(out)setAlpha(x,y,0);
  }

  // === FRIDGE ===
  // Body dimensions
  const fx=Math.round(S*.20), fy=Math.round(S*.10);
  const fw=Math.round(S*.60), fh=Math.round(S*.80);
  const bw=Math.max(2,Math.round(S*.038));

  // Light fill inside fridge (very subtle)
  rectB(fx+bw,fy+bw,fw-bw*2,fh-bw*2,255,255,255,22);

  // Thick white border
  rectB(fx,fy,fw,bw,255,255,255,255);
  rectB(fx,fy+fh-bw,fw,bw,255,255,255,255);
  rectB(fx,fy,bw,fh,255,255,255,255);
  rectB(fx+fw-bw,fy,bw,fh,255,255,255,255);

  // FREEZER section — slightly lighter tint
  const divY=Math.round(fy+fh*.34);
  rectB(fx+bw,fy+bw,fw-bw*2,divY-fy-bw*2,255,255,255,35);

  // DIVIDER — thick amber/warm bar to create contrast
  const dT=Math.max(3,Math.round(S*.038));
  rectB(fx,divY,fw,dT,0xff,0xcc,0x77,230);

  // HANDLES — amber colored, clearly visible
  const hW=Math.round(fw*.36);
  const hX=fx+Math.round(fw*.10);
  const hH=Math.max(3,Math.round(S*.048));
  const hR=Math.round(hH/2);
  // Freezer handle (amber)
  rectB(hX,fy+Math.round(fh*.15),hW,hH,0xff,0xcc,0x77,245);
  // Fridge handle (white)
  rectB(hX,fy+Math.round(fh*.53),hW,hH,255,255,255,230);

  // TEMPERATURE INDICATOR (small amber dot top right of freezer)
  const aX=fx+Math.round(fw*.80), aY=fy+Math.round(fh*.18);
  const aR=Math.max(2,Math.round(S*.035));
  dot(aX,aY,aR,0xff,0xaa,0x44,255);

  // FRESHNESS DOT — bright mint green, bottom right
  const mX=fx+Math.round(fw*.78), mY=fy+Math.round(fh*.70);
  const mR=Math.max(4,Math.round(S*.06));
  dot(mX,mY,Math.round(mR*2.2),0x4a,0xde,0x80,30);
  dot(mX,mY,Math.round(mR*1.5),0x4a,0xde,0x80,80);
  dot(mX,mY,mR,0x22,0xc5,0x5e,255);
  dot(mX-Math.round(mR*.3),mY-Math.round(mR*.3),Math.max(1,Math.round(mR*.3)),255,255,255,200);

  // Encode
  const raw=[];
  for(let y=0;y<S;y++){raw.push(0);for(let x=0;x<S;x++){const i=(y*S+x)*4;raw.push(px[i],px[i+1],px[i+2],px[i+3]);}}
  const comp=zlib.deflateSync(Buffer.from(raw),{level:9});
  const sig=Buffer.from([137,80,78,71,13,10,26,10]);
  const ihdr=chunk("IHDR",Buffer.concat([u32(S),u32(S),Buffer.from([8,6,0,0,0])]));
  const idat=chunk("IDAT",comp);
  const iend=chunk("IEND",Buffer.alloc(0));
  return Buffer.concat([sig,ihdr,idat,iend]);
}

sizes.forEach(size=>{
  const buf=makePNG(size);
  fs.writeFileSync(path.join(outDir,`icon-${size}.png`),buf);
  console.log(`✅ icon-${size}.png`);
});
console.log(`\n🎉 Done`);
