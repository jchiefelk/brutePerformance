'use strict';
var fs = require('fs');
var Promise = require('bluebird');
var readableStream = fs.createReadStream("/usr/share/dict/words");
var now = require('performance-now');
//
// Creates a Trie of Tries
// For Dictionary lookup
// And Levenhenstein distance computation
//
function Trie(){
	this.word = null;
	this.children = {};
};
//
Trie.prototype.insert = function(word) {
	var node = this;	
	for(var x=0;x<word.length; x++){

		if( !node.children[ word[x].toLowerCase() ]){
			node.children[ word[x].toLowerCase()	] = new Trie();
		}

		node = node.children[ word[x].toLowerCase() ];
	};
	node.word = word;
	return;
};
//
Trie.prototype.search = function(word,maxCost){
	let currentRow = [ ];
	for(let x = 0;x<word.length+1;x++){
		currentRow.push(x);
	};
	let results = [];
	// traverse each branch of the tree
	for(var k in trie.children){
		this.traverseChildren(trie.children[k], k.toLowerCase(), word, currentRow, results, maxCost);
	};
	return results;

};
//
Trie.prototype.traverseChildren = function(node, letter, word, previousRow, results,maxCost) {
	let currentRow = [previousRow[0]+1];
	//
	// Create Levenheinstein matrix
	// Column length defined by target word length
	for(var y=0; y<word.length; y++){
			let replaceCost;
			let insertCost = currentRow[y]+1;
			let deleteCost = previousRow[y+1]+1;
			if(word[y] != letter){
				replaceCost = previousRow[y]+1;
			} else{
				replaceCost = previousRow[y];
			}
			currentRow.push( Math.min(insertCost, deleteCost, replaceCost) ); 
	};
	//
	// if last element in matrix represents 
	// optimal solution save
	if(currentRow[word.length] <= maxCost && node.word!=null){
		results.push({
				'word': node.word,
				'distance': currentRow[word.length]
		});
	}
	//
	// 
	// if any values of levenhenstein matrix are less than
	// insertion Cost traverse 
	//
	if(Math.min.apply(null,currentRow) <=maxCost ){
		for(var key in node.children){
			this.traverseChildren(node.children[key], key.toLowerCase(), word, currentRow,results, maxCost);						
		};
	}

};

var getDictionary = function(){
	let data = '';
	let words = [];
	return new Promise(function(resolve,reject){
		readableStream.on('data',function(chunk){
				data+=chunk;
		}).on('end', function(){
		    var array = data.toString().split("\n");
		    for(var i in array) {
		        words.push(array[i]);
		    };
			resolve(words);
		});
	});
};
//
// Main 
//
let trie = new Trie(); 
let target_word = '';
let max_distance;
//
// if input nor formatted properly log errors
//
if (process.argv.length <= 2) {
	console.log("Usage: Missing target word and max edit-distance");
	process.exit(-1);
}

if(process.argv.length == 3 ) {
		if( !isNaN(parseInt(process.argv[2]) ) ) {
				console.log("Usage: Missing target word");
				process.exit(-1);
		}
		if(isNaN(parseInt(process.argv[2]))  ) {
				console.log("Usage: Missing max distance");
				process.exit(-1); 
		}

}

if(process.argv.length == 4){

	if( isNaN(parseInt(process.argv[3]) ) ){
		console.log("Usage: You entered a string not a number for max_distance!!!!");
		process.exit(-1);
	} else {
		max_distance = process.argv[3];
	}
	//
	//
	//
	if( !isNaN(parseInt(process.argv[2]) ) ){
		console.log("Usage: You entered a number not a string for target word!!!!");
		process.exit(-1);
	} else {
		target_word = process.argv[2].toLowerCase();
	}

}


	getDictionary()
		.then((words)=> {
			
			for(var x=0; x<words.length;x++){
				trie.insert(words[x]);
			};
			let start = now();
			let results = trie.search(target_word, max_distance);
			let end = now();
				if(results.length==0){
						console.log('NO SUGGESTION');
					} else{
						console.log(results);
						
						let diff = end-start;
						console.log(diff/1000 +' seconds');
				}
		});
