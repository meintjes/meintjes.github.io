(function() {
    'use strict';

    const output = document.getElementById('output');
    const filePicker = document.getElementById('filepicker');
    const copyButton = document.getElementById('copybutton');
    const copyLabel = document.getElementById('copylabel');

    const SEPARATOR = '\t';
    const NEWLINE = '\r\n';

    filePicker.addEventListener('change', fileSelected);
    copyButton.addEventListener('click', copyToClipboard);

    let loadedFile = false;

    function fileSelected(e) {
        output.value = '';
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
            doneParsing();
        }

        // TODO: Read in parts instead of operating on the whole file.
        reader.readAsText(fileObject);
    }

    function doneParsing() {
        loadedFile = true;
        output.classList.remove('output-collapsed');
        copyLabel.classList.remove('btn-disabled');
    }

    function recordParsed(record) {
        output.value += record.join(SEPARATOR) + NEWLINE;
    }

    function prependFields(header) {
        output.value = header.join(SEPARATOR) + NEWLINE + output.value;
    }

    function copyToClipboard(e) {
        if (!loadedFile) {
            return;
        }

        output.select();
        try {
            const result = document.execCommand('copy');
            if (!result) {
                throw new Error();
            }
            copyButton.classList.replace('btn-error', 'btn-success');
        }
        catch (err) {
            copyButton.classList.add('btn-error', 'btn-success');
        }
    }

})();
