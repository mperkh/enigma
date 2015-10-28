// Simualtion of Enigma M3 enycrption machine 
// Written by Michael Perkhofer, 2015
// https://de.wikipedia.org/wiki/Enigma_(Maschine)#Aufbau

var Enigma = function(config) {
  
  var ukw = config.ukw;
  var walzenlage = config.walzenlage;
  var ringstellung = config.ringstellung;
  var walzenpos = config.walzenpos;
  var steckbrett = config.steckbrett;
  
  var alphabet = 'abcdefghijklmnopqrstuvwxyz';
  
  var walzen = {
    1: {subst: 'ekmflgdqvzntowyhxuspaibrcj', pos: 1, kerbe: 'q'},
    2: {subst: 'ajdksiruxblhwtmcqgznpyfvoe', pos: 1, kerbe: 'e'},
    3: {subst: 'bdfhjlcprtxvznyeiwgakmusqo', pos: 1, kerbe: 'v'},
    4: {subst: 'esovpzjayquirhxlnftgkdcmwb', pos: 1, kerbe: 'j'},
    5: {subst: 'vzbrgityupsdnhlxawmjqofeck', pos: 1, kerbe: 'z'},
  };

  var reflector = {
    a: 'ejmzalyxvbwfcrquontspikhgd',
    b: 'yruhqsldpxngokmiebfzcwvjat',
    c: 'fvpjiaoyedrzxwgctkuqsbnmhl'
  };

  this.pressKey = function(key) {
    var result = key;
    rotateW(walzenlage[2]);
    console.log(walzenlage.reduce((prev, curr) => {
      return prev + alphabet.charAt(walzen[curr].pos-1).toUpperCase()
    }, ''));
    result = processS(result);
    result = processW(result, walzenlage[2], true);
    result = processW(result, walzenlage[1], true);
    result = processW(result, walzenlage[0], true);
    result = processR(result);
    result = processW(result, walzenlage[0], false);
    result = processW(result, walzenlage[1], false);
    result = processW(result, walzenlage[2], false);
    result = processS(result);
    return result
  };

  function rotateW(w, init) {
    function rotate(w) {
      walzen[w].subst += walzen[w].subst.charAt(0);
      walzen[w].subst = walzen[w].subst.slice(1);
      if (walzen[w].pos === 26) walzen[w].pos = 0;
      walzen[w].pos += 1;
    }

    rotate(w);

    if (!init && walzen[w].pos === alphabet.indexOf(walzen[w].kerbe) + 2) {
      rotate(walzenlage[1]);
      return;
    }

    if (!init && walzen[walzenlage[1]].pos === alphabet.indexOf(walzen[walzenlage[1]].kerbe) + 1) {   
      rotate(walzenlage[0]);
      rotate(walzenlage[1]); // Anomalie
    }
  };

  function processW(key, w, rein) {
    var trans = '';
    var finalPos = '';

    if (rein) {
      trans = walzen[w].subst.charAt(alphabet.indexOf(key));
      finalPos = alphabet.indexOf(trans) - walzen[w].pos + ringstellung[walzenlage.indexOf(w)];
    }
    else {
      a = alphabet.indexOf(key) + walzen[w].pos - ringstellung[walzenlage.indexOf(w)];
      if (a < 0) a += 26;
      if (a >= 26) a -= 26;
      trans = alphabet.charAt(walzen[w].subst.indexOf(alphabet.charAt(a)));
      finalPos = alphabet.indexOf(trans);
    } 
    
    if (finalPos < 0) finalPos += 26;
    if (finalPos > 26) finalPos -= 26;
    
    return alphabet.charAt(finalPos);
  };

  function processR(key) {
    return reflector[ukw].charAt(alphabet.indexOf(key))
  };

  function processS(key, rein) {
    var result = key;
    steckbrett.forEach(s => {
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

  walzenlage.forEach( (w, index)  => {
    for (i=1; i < ringstellung[index]; i++) {
      walzen[w].subst = walzen[w].subst.charAt(25) + walzen[w].subst.substr(0, 25);
    }
    for (i=0; i < alphabet.indexOf(walzenpos[index]); i++) {
      rotateW(w, true)
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
