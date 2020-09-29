var express = require('express');
const db = require('../dataController');

exports.displayKeywordList = function(req, res) {
	const debug = true;
	const parray = getDataArray();
	
	res.render('viewEntriesKeywords', { title: 'Keywords List', principlesArray: parray });
}