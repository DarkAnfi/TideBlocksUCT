from PIL import Image
names = [
	"default",
	"primary",
	"success",
	"info",
	"warning",
	"danger"
]

imgs = [(Image.open(name+".png"), name) for name in names]
for img, name in imgs:
	img.crop((0,0,60,10)).save("./" + name + "/tl.png")
	img.crop((60,0,61,10)).save("./" + name + "/t.png")
	img.crop((61,0,71,10)).save("./" + name + "/tr.png")

	img.crop((0,10,60,11)).save("./" + name + "/ml.png")
	img.crop((60,10,61,11)).save("./" + name + "/m.png")
	img.crop((61,10,71,11)).save("./" + name + "/mr.png")

	img.crop((0,11,60,26)).save("./" + name + "/bl.png")
	img.crop((60,11,61,26)).save("./" + name + "/b.png")
	img.crop((61,11,71,26)).save("./" + name + "/br.png")