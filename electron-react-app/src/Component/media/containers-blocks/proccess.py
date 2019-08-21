from PIL import Image
names = [
	"default",
	"primary",
	"success",
	"info",
	"warning",
	"danger",
	"default-selected",
	"primary-selected",
	"success-selected",
	"info-selected",
	"warning-selected",
	"danger-selected"
]

imgs = [(Image.open(name+".png"), name) for name in names]
for img, name in imgs:
	img.crop((0,0,80,10)).save("./" + name + "/htl.png")
	img.crop((80,0,81,10)).save("./" + name + "/ht.png")
	img.crop((81,0,91,10)).save("./" + name + "/htr.png")

	img.crop((0,10,80,11)).save("./" + name + "/hml.png")
	img.crop((80,10,81,11)).save("./" + name + "/hm.png")
	img.crop((81,10,91,11)).save("./" + name + "/hmr.png")

	img.crop((0,11,80,31)).save("./" + name + "/btl.png")
	img.crop((80,11,81,31)).save("./" + name + "/bt.png")
	img.crop((81,11,91,31)).save("./" + name + "/btr.png")

	img.crop((0,31,80,32)).save("./" + name + "/bml.png")
	img.crop((80,31,81,32)).save("./" + name + "/bm.png")
	img.crop((81,31,91,32)).save("./" + name + "/bmr.png")

	img.crop((0,32,80,52)).save("./" + name + "/bbl.png")
	img.crop((80,32,81,52)).save("./" + name + "/bb.png")
	img.crop((81,32,91,52)).save("./" + name + "/bbr.png")

	img.crop((0,52,80,53)).save("./" + name + "/fml.png")
	img.crop((80,52,81,53)).save("./" + name + "/fm.png")
	img.crop((81,52,91,53)).save("./" + name + "/fmr.png")

	img.crop((0,53,80,68)).save("./" + name + "/fbl.png")
	img.crop((80,53,81,68)).save("./" + name + "/fb.png")
	img.crop((81,53,91,68)).save("./" + name + "/fbr.png")