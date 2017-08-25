(function() {
    'use strict';

    const SEPARATOR = '\t';
    const NEWLINE = '\r\n';

    filepicker.addEventListener('change', fileSelected, false);

    function fileSelected(e) {
        const fileObject = e.target.files[0];
        handleFile(fileObject);
    }

    function handleFile(fileObject) {
        const parser = new Parser(recordParsed);
        const reader = new FileReader();

        reader.onload = function(e) {
            const contents = e.target.result;
            const lines = contents.split(/\r\n|\n|\r/g);
            for (const line of lines) {
                parser.line(line);
            }
            parser.end();

            prependFields(parser.getHeader());
        }

        // TODO: Read in parts instead of operating on the whole file.
        reader.readAsText(fileObject);
    }

    function recordParsed(record) {
        output.value += record.join(SEPARATOR) + NEWLINE;
    }

    function prependFields(header) {
        output.value = header.join(SEPARATOR) + NEWLINE + output.value;
    }
})();
