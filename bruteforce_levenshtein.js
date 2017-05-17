'use strict';
var fs = require('fs');
var Promise = require('bluebird');
var readableStream = fs.createReadStream("/usr/share/dict/words");

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
function levenshtein(target_word, dict_word){;
	let columns = target_word.length;
	let rows = dict_word.length;
	let currentRow=[0];
	// Create Matrix
	// column length set by target word length
	//
	//
	for(let x=0;x<columns;x++){
		currentRow.push(currentRow[x]+1);
	};
	// row length set by dictionary word length
	for(let x=0;x<rows;x++){
		let previousRow = currentRow;
		currentRow = [  previousRow[0]+1 ];
		for(var y=0; y<columns; y++){
			let substitutionCost; // 
			let insertCost = currentRow[y]+1; // in levenshetein algo insertions and deletion each cost 1
			let deleteCost = previousRow[y+1]+1;
			if(target_word[y] != dict_word[x]){
				substitutionCost = previousRow[y]+1;
			} else{
				substitutionCost = previousRow[y];
			}
			currentRow.push( Math.min(insertCost, deleteCost, substitutionCost) );
		};
	};
	return currentRow.pop();
};
function searchForMatches(words, target_word, maxDistance){
	let results = [];
	for(var x=0;x<words.length; x++){
		let word =  words[x];
		let edit_distance = levenshtein(target_word,word);
		if(edit_distance<=maxDistance){
			results.push({
				'word': word, 
				'edit_distance': edit_distance
			});
		}
	};
	return results;
};
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

//
// Promise Chain
//
getDictionary()
			.then((words)=> {
					let results = searchForMatches(words,target_word,max_distance);
					if(results.length==0){
						console.log('NO SUGGESTION');
					} else{
						console.log(results);
					}

			});
