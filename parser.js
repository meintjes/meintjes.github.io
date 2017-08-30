function Parser(recordParsedCallback) {
    this._callback = recordParsedCallback;
    this._fields = ['N'];
    this._done = false;
}

(function() {
    'use strict';

    const newRecordRegex = /^Document (\d+) of \d+$/g;
    const fieldRegex = /^([^\s]*)(.+)$/;

    Parser.prototype.line = function(line) {
        const newRecordMatch = newRecordRegex.exec(line);
        if (newRecordMatch) {
            const [match, recordIndex] = newRecordMatch;
            this._flush();
            this._currentRecord[0] = recordIndex;

            return;
        }

        const fieldMatch = fieldRegex.exec(line);
        if (fieldMatch) {
            const [match, name, value] = fieldMatch;
            if (name) {
                this._setCurrentField(name);
            }
            this._appendToCurrentField(value);

            return;
        }
    }

    Parser.prototype.end = function() {
        this._flush();
        this._done = true;
    }

    Parser.prototype.getHeader = function() {
        return this._fields;
    }

    Parser.prototype._setCurrentField = function(name) {
        let index = this._fields.indexOf(name);
        if (index === -1) {
            index = this._fields.length;
            this._fields.push(name);
        }

        this._currentFieldIndex = index;
    }

    Parser.prototype._appendToCurrentField = function(value) {
        if (typeof this._currentFieldIndex !== 'number') {
            throw new Error('Field is missing descriptor');
        }

        value = value.trim();

        const currentValue = this._currentRecord[this._currentFieldIndex];
        this._currentRecord[this._currentFieldIndex] = currentValue ?
            currentValue + ' ' + value :
            value;
    }

    Parser.prototype._flush = function() {
        if (this._currentRecord && !this._done) {
            this._callback(this._currentRecord);
        }
        this._currentRecord = Array(this._fields.length).fill('');
        this._currentFieldIndex = null;
    }

})();
