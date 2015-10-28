// Simualtion of Enigma M3 enycrption machine 
// Written by Michael Perkhofer, 2015
// https://de.wikipedia.org/wiki/Enigma_(Maschine)#Aufbau

var Enigma = function(config) {
  
  this.ukw = config.ukw;
  this.walzenlage = config.walzenlage;
  this.ringstellung = config.ringstellung;
  this.walzenpos = config.walzenpos;
  this.steckbrett = config.steckbrett;
  
  this.egw = 'abcdefghijklmnopqrstuvwxyz';
  
  this.walzen = {
    1: {subst: 'ekmflgdqvzntowyhxuspaibrcj', pos: 1, kerbe: 'q'},
    2: {subst: 'ajdksiruxblhwtmcqgznpyfvoe', pos: 1, kerbe: 'e'},
    3: {subst: 'bdfhjlcprtxvznyeiwgakmusqo', pos: 1, kerbe: 'v'},
    4: {subst: 'esovpzjayquirhxlnftgkdcmwb', pos: 1, kerbe: 'j'},
    5: {subst: 'vzbrgityupsdnhlxawmjqofeck', pos: 1, kerbe: 'z'},
  };

  this.reflector = {
    a: 'ejmzalyxvbwfcrquontspikhgd',
    b: 'yruhqsldpxngokmiebfzcwvjat',
    c: 'fvpjiaoyedrzxwgctkuqsbnmhl'
  };

  this.pressKey = function(key) {
    var result = key;
    this.rotateW(this.walzenlage[2]);
    console.log(this.walzenlage.reduce((prev, curr) => {
      return prev + this.egw.charAt(this.walzen[curr].pos-1).toUpperCase()
    }, ''));
    result = this.processS(result);
    result = this.processW(result, this.walzenlage[2], true);
    result = this.processW(result, this.walzenlage[1], true);
    result = this.processW(result, this.walzenlage[0], true);
    result = this.processR(result);
    result = this.processW(result, this.walzenlage[0], false);
    result = this.processW(result, this.walzenlage[1], false);
    result = this.processW(result, this.walzenlage[2], false);
    result = this.processS(result);
    return result
  };

  this.rotateW = function(w, init) {
    this.rotate = function (w) {
      this.walzen[w].subst += this.walzen[w].subst.charAt(0);
      this.walzen[w].subst = this.walzen[w].subst.slice(1);
      if (this.walzen[w].pos === 26) this.walzen[w].pos = 0;
      this.walzen[w].pos += 1;
    }

    this.rotate(w);

    if (!init && this.walzen[w].pos === this.egw.indexOf(this.walzen[w].kerbe) + 2) {
      this.rotate(this.walzenlage[1]);
      return;
    }

    if (!init && this.walzen[this.walzenlage[1]].pos === this.egw.indexOf(this.walzen[this.walzenlage[1]].kerbe) + 1) {   
      this.rotate(this.walzenlage[0]);
      this.rotate(this.walzenlage[1]); // Anomalie
    }
  };

  this.processW = function(key, w, rein) {
    var trans = '';
    var finalPos = '';

    if (rein) {
      trans = this.walzen[w].subst.charAt(this.egw.indexOf(key));
      finalPos = this.egw.indexOf(trans) - this.walzen[w].pos + this.ringstellung[this.walzenlage.indexOf(w)];
    }
    else {
      a = this.egw.indexOf(key) + this.walzen[w].pos - this.ringstellung[this.walzenlage.indexOf(w)];
      if (a < 0) a += 26;
      if (a >= 26) a -= 26;
      trans = this.egw.charAt(this.walzen[w].subst.indexOf(this.egw.charAt(a)));
      finalPos = this.egw.indexOf(trans);
    } 
    
    if (finalPos < 0) finalPos += 26;
    if (finalPos > 26) finalPos -= 26;
    
    return this.egw.charAt(finalPos);
  };

  this.processR = function(key) {
    return this.reflector[this.ukw].charAt(this.egw.indexOf(key))
  };

  this.processS = function(key, rein) {
    var result = key;
    this.steckbrett.forEach(s => {
      if (key === s.charAt(0).toLowerCase()) {
        result = s.charAt(1).toLowerCase();
      }
      else if (key === s.charAt(1).toLowerCase()) {
        result = s.charAt(0).toLowerCase();
      }
    });
    return result
  }

  // Initialization of Enigma machine

  this.walzenlage.forEach( (w, index)  => {
    for (i=1; i < this.ringstellung[index]; i++) {
      this.walzen[w].subst = this.walzen[w].subst.charAt(25) + this.walzen[w].subst.substr(0, 25);
    }
    for (i=0; i < this.egw.indexOf(this.walzenpos[index]); i++) {
      this.rotateW(w, true)
    }
  });

};

var config = {
  ukw: 'b',
  walzenlage: [1, 2, 3],
  ringstellung: [16, 26, 08],
  walzenpos: ['a','d','u'],
  steckbrett: ['AD', 'CN', 'ET', 'FL', 'GI', 'JV', 'KZ', 'PU', 'QY', 'WX']
}

var Machine = new Enigma(config);
var input = 'AACHENISTGERETTET'.toLowerCase().split('');
console.log(input.map((i) => Machine.pressKey(i)).join('').toUpperCase());
