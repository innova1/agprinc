
exports.ItemFinder = function(framework, type, ordinal) {
	const debug = false;
	this.framework = framework;
	this.type = type;
	this.ordinal = ordinal;
	this.key = framework+type+ordinal;
}

module.exports = tools;