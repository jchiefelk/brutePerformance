<h1>Performance Test of Dictionary Search - Python-3.5.2 vs Node.js v7.4.0 </h1>

<p> The winner is, JavaScript!!!!! On my 2014 Macbook Pro with 2.6 GHz Intel Core i5, 8 GB 1600 MHz DDR3, JavaScript runs 2.53 times faster than Python-3 when performing dictionary lookup on a Trie data structure. </p>

<p>
  Spell Checking with JavaScript, using 2 different approaches.
</p>

<h3>Brute-Force Levenshtein</h3>

<p>
  This was my first approach after some initial research.  I found this
  <a href="http://stackoverflow.com/questions/2294915/what-algorithm-gives-suggestions-in-a-spell-checker">
   Stack Overflow   
  </a> thread the most helpful resource.  bruteforce_levenshtein.js brute force computes the edit distance between a 
  target word and words in a dictionary. The script bruteforce_levenshtein.js reads in dictionary words from 
  "/usr/share/dict/words" into an array.  The array is then iterated through and the levenshtein edit distance is 
  computed at each iteration.  It is an O(N*M) algoritm for each word in a dictionary of hundreds of thousands of words,       where N is length of target word and M is the length of the dictionary at a a given index.
</p>

<h3>Levenhenstein Computations using Recursive Tree Traversals</h3>

<p> 
In spellcheck_trie.js A Trie of Tries is used to store the dictionary words.  Then each branch in the Trie is then recursively traverse, and an       edit distance is computed for each target letter and the key values of the nodes in the Trie.  This has a runtime of O(N*C).   N is the character length of the target word and C is the number of nodes in the Trie.
</p>

<h3>Build and Run</h3>

<p>
  I am running Node version 7.4.0.  To run the scripts do the following in your terminal.   
</p>
<pre>
  git clone https://github.com/jchiefelk/inspector_de_gramtica_con_javascript.git
  cd /Users/ggt/independent/inspector_de_gramtica_con_javascript
  npm install
  node bruteforce_levenshtein.js "Target Word" max_distance
  node spellcheck_trie.js "Target Word" max_distance
</pre>

<p>
"Target Word" is the mispelled word, max_distance is the a filter used to refine the quality of the search.  The program will only return results that have an edit distance less than or equal than max_distance
</p>

