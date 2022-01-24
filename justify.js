const MAX_LINE_LENGTH = 80;

// if left justify, just add a space after each word
function leftJustify(words, i, j) {
	let res = words[i];

	for (let k = i + 1; k < j; ++k) {
		res += ' ' + words[k];
	}

  	return res;
}

// if middle justify, see how many words there is and how many spaces need to be added
function middleJustify(words, diff, i, j) {
	let spacesNeeded = j - i - 1,
		spaces = diff / spacesNeeded,
		extraSpaces = diff % spacesNeeded,
		res = words[i];

	for (let k = i + 1; k < j; ++k) {
		let spacesToApply = spaces + (extraSpaces-- > 0 ? 1 : 0);
		res += ' '.repeat(spacesToApply) + words[k];
	}

	return res;
}

function justify(text) {
    const words = text.split(' '); // make the text as an array of strings

	let i = 0, n = words.length, res = '';

	while(i < n) { // for every words of the text
		let j = i + 1, lineLength = words[i].length, newLine = false;

        // for every line line length start with the word length then for every word added, there's a min 1 space added
		while (j < n && (lineLength + words[j].length + (j - i - 1)) < MAX_LINE_LENGTH) { // firstword + space + secondword
			if (/\s/.test(words[j])) { // check if there's whitespaces -> true if yes
				console.log(words[j])
                newLine = true;
				words[j] = words[j].split(/^\s/g).join('');
				if (/\s$/.test(words[j])) ++j;
				break;
			}
			lineLength += words[j++].length; // add the word lenght to the line length and go to the next word
		}

		let diff = MAX_LINE_LENGTH - lineLength; // number of white spaces in the line
		let numberOfWords = j - i; 
		if (numberOfWords === 1 || j >= n || newLine) res += leftJustify(words, i, j);
		else res += middleJustify(words, diff, i, j);
		res+='\n';
		i = j;
	}
    
	return res;
}

module.exports = justify;