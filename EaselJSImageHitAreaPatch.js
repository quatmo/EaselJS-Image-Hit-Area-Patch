//more info : https://github.com/artsjedi/EaselJS-Image-Hit-Area-Patch/blob/master/EaselJSImageHitAreaPatch

with (createjs) {
    createjs.Container.prototype._getObjectsUnderPoint = function (x, y, arr, mouse) {
        var ctx = createjs.DisplayObject._hitTestContext;
        var mtx = this._matrix;

        // draw children one at a time, and check if we get a hit:
        var l = this.children.length;
        for (var i = l - 1; i >= 0; i--) {
            var child = this.children[i];
            var hitArea = mouse && child.hitArea;
            if (!child.visible || (!hitArea && !child.isVisible()) || (mouse && !child.mouseEnabled)) { continue; }
            // if a child container has a hitArea then we only need to check its hitArea, so we can treat it as a normal DO:
            if (!hitArea && child instanceof Container) {
                var result = child._getObjectsUnderPoint(x, y, arr, mouse);
                if (!arr && result) { return result; }
            } else {
                child.getConcatenatedMatrix(mtx);

                if (hitArea) {
                    mtx.appendTransform(hitArea.x, hitArea.y, hitArea.scaleX, hitArea.scaleY, hitArea.rotation, hitArea.skewX, hitArea.skewY, hitArea.regX, hitArea.regY);
                    mtx.alpha = hitArea.alpha;
                }

                // doesen't calculate hitArea for bitmaps istances avoiding cross domain errors and unecessary processing.
                if (child instanceof createjs.Bitmap && !hitArea)
                    return null;

                ctx.globalAlpha = mtx.alpha;
                ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx - x, mtx.ty - y);
                (hitArea || child).draw(ctx);
                if (!this._testHit(ctx)) { continue; }
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, 2, 2);
                if (arr) { arr.push(child); }
                else { return (mouse && !this.mouseChildren) ? this : child; }

            }
        }
        return null;
    };
}
