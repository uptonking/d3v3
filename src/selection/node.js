import "selection";

/**
 * 返回选择集的第1个节点
 */
d3_selectionPrototype.node = function () {

    for (var j = 0, m = this.length; j < m; j++) {

        for (var group = this[j], i = 0, n = group.length; i < n; i++) {
            var node = group[i];
            if (node) return node;
        }

    }
    return null;
};
