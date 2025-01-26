const Base64 = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  /**
   * 将字符串编码为Base64格式
   * @param {string} input - 要编码的字符串
   * @returns {string} Base64编码后的字符串
   */
  encode: function(input) {
    let output = "";
    let char1, char2, char3;
    let enc1, enc2, enc3, enc4;
    let i = 0;

    input = Base64._utf8_encode(input);
    
    while (i < input.length) {
      char1 = input.charCodeAt(i++);
      char2 = input.charCodeAt(i++);
      char3 = input.charCodeAt(i++);

      enc1 = char1 >> 2;
      enc2 = ((char1 & 3) << 4) | (char2 >> 4);
      enc3 = ((char2 & 15) << 2) | (char3 >> 6);
      enc4 = char3 & 63;

      if (isNaN(char2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(char3)) {
        enc4 = 64;
      }

      output = output +
        Base64._keyStr.charAt(enc1) +
        Base64._keyStr.charAt(enc2) +
        Base64._keyStr.charAt(enc3) +
        Base64._keyStr.charAt(enc4);
    }
    return output;
  },
  /**
   * 将Base64字符串解码为原始字符串
   * @param {string} input - Base64编码的字符串
   * @returns {string} 解码后的原始字符串
   */
  decode: function(input) {
    let output = "";
    let char1, char2, char3;
    let enc1, enc2, enc3, enc4;
    let i = 0;

    input = input.replace(/[^A-Za-z0-9+/=]/g, "");

    while (i < input.length) {
      enc1 = Base64._keyStr.indexOf(input.charAt(i++));
      enc2 = Base64._keyStr.indexOf(input.charAt(i++));
      enc3 = Base64._keyStr.indexOf(input.charAt(i++));
      enc4 = Base64._keyStr.indexOf(input.charAt(i++));

      char1 = (enc1 << 2) | (enc2 >> 4);
      char2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      char3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(char1);
      
      if (enc3 != 64) {
        output = output + String.fromCharCode(char2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(char3);
      }
    }
    return Base64._utf8_decode(output);
  },
  /**
   * 将字符串编码为UTF-8格式
   * @param {string} input - 要编码的字符串
   * @returns {string} UTF-8编码后的字符串
   */
  _utf8_encode: function(input) {
    let output = "";
    let charCode;

    input = input.replace(/\r\n/g, "\n");

    for (let i = 0; i < input.length; i++) {
      charCode = input.charCodeAt(i);

      if (charCode < 128) {
        output += String.fromCharCode(charCode);
      } else if (charCode > 127 && charCode < 2048) {
        output += String.fromCharCode((charCode >> 6) | 192);
        output += String.fromCharCode((charCode & 63) | 128);
      } else {
        output += String.fromCharCode((charCode >> 12) | 224);
        output += String.fromCharCode(((charCode >> 6) & 63) | 128);
        output += String.fromCharCode((charCode & 63) | 128);
      }
    }
    return output;
  },
  /**
   * 将UTF-8字符串解码为原始字符串
   * @param {string} input - UTF-8编码的字符串
   * @returns {string} 解码后的原始字符串
   */
  _utf8_decode: function(input) {
    let output = "";
    let i = 0;
    let charCode, c2, c3;

    while (i < input.length) {
      charCode = input.charCodeAt(i);

      if (charCode < 128) {
        output += String.fromCharCode(charCode);
        i++;
      } else if (charCode > 191 && charCode < 224) {
        c2 = input.charCodeAt(i + 1);
        output += String.fromCharCode(((charCode & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = input.charCodeAt(i + 1);
        c3 = input.charCodeAt(i + 2);
        output += String.fromCharCode(
          ((charCode & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        );
        i += 3;
      }
    }
    return output;
  }
};

export default Base64;
