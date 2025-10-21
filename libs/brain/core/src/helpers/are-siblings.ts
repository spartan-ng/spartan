export function areSiblings(elm1: Node, elm2: Node) {
	return elm1 != elm2 && elm1.parentNode == elm2.parentNode;
}
