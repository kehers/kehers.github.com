
var Snag = function(){
    this.wordsObj = {};
    this.categoryCounts = {
        'Spam': 0,
        'Nonspam': 0
    };
    this.strength = 1;
    this.PrC = 0.5;
};

Snag.prototype = {
    train : function(doc, category) {
        var words = this.splitWords(doc);
        this.categoryCounts[category] += words.length;
        _.each(words, function(word) {
            // > 2 characters
            if (word.length < 3)
                return;
            // lower case
            //word = word.toLowerCase();
                
            this.wordsObj[word] = this.wordsObj[word] || {};
            this.wordsObj[word][category] = this.wordsObj[word][category] ? this.wordsObj[word][category] + 1 : 1;
        }, this);
        
        //console.log(this.wordsObj);
        //console.log(this.categoryCounts);
    },
    
    classify: function(doc) {
        var words = this.splitWords(doc);
        var wordProb = {};
        var cWordProb = {};
        _.each(words, function(word) {
            // > 2 characters
            if (word.length < 3)
                return;
            // Case sensitivity?
            //word = word.toLowerCase();
            this.wordsObj[word] = this.wordsObj[word] || {};
            
            // Normal probabilty
            /*_.each(this.categoryCounts, function(count, category) {
                this.wordsObj[word][category] = this.wordsObj[word][category] || 0;
                var probability = this.wordsObj[word][category]/count;
                if (probability != 0) {
                    wordProb[category] = wordProb[category] || 1;  
                    wordProb[category] *= probability;
                }
            }, this);//*/
            
            // Corrected probability
            _.each(this.categoryCounts, function(count, category) {
                this.wordsObj[word][category] = this.wordsObj[word][category] || 0;
                var probability = this.wordsObj[word][category]/count;
                // Total occurence in categories
                var n = 0;
                _.each(this.categoryCounts, function(c) {
                    n += c;
                });
                cWordProb[category] = cWordProb[category] || 1;
                cWordProb[category] *= (this.strength*this.PrC + n*probability)/(this.strength+n);
            }, this);
        }, this);
        
        //console.log(wordProb);        
        console.log(cWordProb);        
        var highest = _.reduce(cWordProb, function(max, prob, cat) {
          return max.prob > prob ? max : {cat: cat, prob: prob};
        }, {prob: 0});
        
        return highest.cat;
    },
    
    splitWords : function(doc) {
        var words = doc.split(/\W+/);
        return _.uniq(words);
    },
    
}