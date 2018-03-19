// d3.tip - Tooltips for d3.js SVG visualizations
// Copyright (c) 2013 Justin Palmer
//顶层是UMD模块定义
//暴露的方法有
// show()
// hide()
// attr(n, v)
// style(n, v)
// direction(v)
// offset(v)
// html(v)
// destroy()
(function (root, factory) {

        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module with d3 as a dependency.
            define(['d3'], factory)
        } else if (typeof module === 'object' && module.exports) {
            // CommonJS. node support
            module.exports = function (d3) {
                d3.tip = factory(d3)
                return d3.tip;
            }
        } else {
            // Browser global.
            root.d3.tip = factory(root.d3)
        }
    }(this, function (d3) {

        // Public - contructs a new tooltip 工厂模式创建tip对象
        //
        // Returns a tip object
        return function () {

            var direction = d3_tip_direction,
                offset = d3_tip_offset,
                html = d3_tip_html,
                //tip显示的容器节点
                node = initNode(),
                svg = null,
                point = null,
                target = null;

            /**
             * 创建tip对象
             * @param vis 要为之创建tip的svg元素
             */
            function tip(vis) {
                //获取svg dom节点
                svg = getSVGNode(vis);
                //创建svg顶点坐标
                point = svg.createSVGPoint();

                document.body.appendChild(node);
            }

            // Public - show the tooltip on the screen
            //
            // Returns a tip
            tip.show = function () {
                var args = Array.prototype.slice.call(arguments)
                if (args[args.length - 1] instanceof SVGElement) target = args.pop();

                var content = html.apply(this, args),
                    poffset = offset.apply(this, args),
                    dir = direction.apply(this, args),
                    nodel = getNodeEl(),
                    i = directions.length,
                    coords,
                    scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                    scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft

                nodel.html(content)
                    .style({opacity: 1, 'pointer-events': 'all'})

                while (i--) nodel.classed(directions[i], false)
                coords = direction_callbacks.get(dir).apply(this)
                nodel.classed(dir, true).style({
                    top: (coords.top + poffset[0]) + scrollTop + 'px',
                    left: (coords.left + poffset[1]) + scrollLeft + 'px'
                })

                return tip;
            }

            // Public - hide the tooltip
            //
            // Returns a tip
            tip.hide = function () {
                var nodel = getNodeEl()
                //元素永远不会成为鼠标事件的target
                nodel.style({opacity: 0, 'pointer-events': 'none'})
                return tip;
            }

            // Public: Proxy attr calls to the d3 tip container.  Sets or gets attribute value.
            // 代理给d3来操作属性
            // n - name of the attribute
            // v - value of the attribute
            //
            // Returns tip or attribute value
            tip.attr = function (n, v) {
                if (arguments.length < 2 && typeof n === 'string') {
                    return getNodeEl().attr(n)
                } else {
                    var args = Array.prototype.slice.call(arguments)
                    d3.selection.prototype.attr.apply(getNodeEl(), args)
                }

                return tip;
            }

            // Public: Proxy style calls to the d3 tip container.  Sets or gets a style value.
            //
            // n - name of the property
            // v - value of the property
            //
            // Returns tip or style property value
            tip.style = function (n, v) {
                if (arguments.length < 2 && typeof n === 'string') {
                    return getNodeEl().style(n)
                } else {
                    var args = Array.prototype.slice.call(arguments)
                    d3.selection.prototype.style.apply(getNodeEl(), args)
                }

                return tip;
            }

            // Public: Set or get the direction of the tooltip
            //
            // v - One of n(north), s(south), e(east), or w(west), nw(northwest),
            //     sw(southwest), ne(northeast) or se(southeast)
            //
            // Returns tip or direction
            tip.direction = function (v) {
                if (!arguments.length) return direction
                direction = v == null ? v : d3.functor(v)

                return tip;
            }

            // Public: Sets or gets the offset of the tip
            //
            // v - Array of [x, y] offset
            //
            // Returns offset or
            tip.offset = function (v) {
                if (!arguments.length) return offset
                offset = v == null ? v : d3.functor(v)

                return tip;
            }

            // Public: sets or gets the html value of the tooltip
            //
            // v - String value of the tip
            //
            // Returns html value or tip
            tip.html = function (v) {
                if (!arguments.length) return html;
                //返回传入的生成html的方法
                html = v == null ? v : d3.functor(v)

                return tip;
            }

            // Public: destroys the tooltip and removes it from the DOM
            //
            // Returns a tip
            tip.destroy = function () {
                if (node) {
                    getNodeEl().remove();
                    node = null;
                }
                return tip;
            }

            function d3_tip_direction() {
                return 'n';
            }

            function d3_tip_offset() {
                return [0, 0];
            }

            function d3_tip_html() {
                return ' ';
            }

            var direction_callbacks = d3.map({
                    n: direction_n,
                    s: direction_s,
                    e: direction_e,
                    w: direction_w,
                    nw: direction_nw,
                    ne: direction_ne,
                    sw: direction_sw,
                    se: direction_se
                }),

                directions = direction_callbacks.keys()

            function direction_n() {
                var bbox = getScreenBBox();
                return {
                    top: bbox.n.y - node.offsetHeight,
                    left: bbox.n.x - node.offsetWidth / 2
                }
            }

            function direction_s() {
                var bbox = getScreenBBox()
                return {
                    top: bbox.s.y,
                    left: bbox.s.x - node.offsetWidth / 2
                }
            }

            function direction_e() {
                var bbox = getScreenBBox()
                return {
                    top: bbox.e.y - node.offsetHeight / 2,
                    left: bbox.e.x
                }
            }

            function direction_w() {
                var bbox = getScreenBBox()
                return {
                    top: bbox.w.y - node.offsetHeight / 2,
                    left: bbox.w.x - node.offsetWidth
                }
            }

            function direction_nw() {
                var bbox = getScreenBBox()
                return {
                    top: bbox.nw.y - node.offsetHeight,
                    left: bbox.nw.x - node.offsetWidth
                }
            }

            function direction_ne() {
                var bbox = getScreenBBox()
                return {
                    top: bbox.ne.y - node.offsetHeight,
                    left: bbox.ne.x
                }
            }

            function direction_sw() {
                var bbox = getScreenBBox()
                return {
                    top: bbox.sw.y,
                    left: bbox.sw.x - node.offsetWidth
                }
            }

            function direction_se() {
                var bbox = getScreenBBox()
                return {
                    top: bbox.se.y,
                    left: bbox.e.x
                }
            }

            /**
             * 创建一个透明的div作为tip显示的容器
             * 返回div的dom节点
             */
            function initNode() {
                var node = d3.select(document.createElement('div'));
                node.style({
                    position: 'absolute',
                    top: 0,
                    opacity: 0,
                    'pointer-events': 'none',
                    'box-sizing': 'border-box'
                });

                return node.node();
            }

            /**
             * 获取svg的dom元素
             */
            function getSVGNode(el) {
                el = el.node();
                if (el.tagName.toLowerCase() === 'svg')
                    return el;

                //否则返回最近父svg元素
                return el.ownerSVGElement;
            }

            /**
             * 返回d3的node selection
             */
            function getNodeEl() {
                if (node === null) {
                    node = initNode();
                    // re-add node to DOM
                    document.body.appendChild(node);
                }
                return d3.select(node);
            }

            // Private - gets the screen coordinates of a shape 获取形状的屏幕坐标
            //
            // Given a shape on the screen, will return an SVGPoint for the directions
            // n(north), s(south), e(east), w(west), ne(northeast), se(southeast), nw(northwest), sw(southwest).
            //
            //    +-+-+
            //    |   |
            //    +   +
            //    |   |
            //    +-+-+
            //
            // Returns an Object {n, s, e, w, nw, sw, ne, se}
            function getScreenBBox() {
                var targetel = target || d3.event.target;

                while ('undefined' === typeof targetel.getScreenCTM && 'undefined' === targetel.parentNode) {
                    targetel = targetel.parentNode;
                }

                var bbox = {},
                    //eturns a DOMMatrix representing the matrix that transforms the current element's coordinate system
                    // to the coordinate system of the SVG viewport for the SVG document fragment.
                    matrix = targetel.getScreenCTM(),
                    //getBBox() returns a DOMRect representing the computed bounding box of the current element,
                    // returns an empty DOMRect when there is no fill
                    tbbox = targetel.getBBox(),
                    width = tbbox.width,
                    height = tbbox.height,
                    x = tbbox.x,
                    y = tbbox.y

                point.x = x
                point.y = y
                //matrixTransform()将point进行matrix变换得到新点
                bbox.nw = point.matrixTransform(matrix)
                point.x += width
                bbox.ne = point.matrixTransform(matrix)
                point.y += height
                bbox.se = point.matrixTransform(matrix)
                point.x -= width
                bbox.sw = point.matrixTransform(matrix)

                point.y -= height / 2
                bbox.w = point.matrixTransform(matrix)

                point.x += width
                bbox.e = point.matrixTransform(matrix)

                point.x -= width / 2
                point.y -= height / 2
                bbox.n = point.matrixTransform(matrix)

                point.y += height
                bbox.s = point.matrixTransform(matrix)

                return bbox;

                // end for getScreenBBox()
            }

            return tip;
        };

        // end for (this, function(){}  )
    })

// end for 立即执行函数最外层括号
);
