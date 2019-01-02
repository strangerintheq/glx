
var ShaderLoader = (function () {
    return {
        load: loadShaderSource
    };

    function loadShaderSource(src, onLoad) {
        req(src, function (response) {
            glueShader(response, onLoad);
        });
    }

    function req(url, onLoad) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.onload = function () {
            xhr.readyState === 4 && xhr.status === 200 && onLoad(xhr.responseText);
        };
        xhr.send();
    }


    function glueShader(source, onReady) {
        var TAG = '#pragma import ';

        if (source.indexOf(TAG) === -1)
            return onReady(source);

        var loading = source.split('\n').map(function (row) {
            return row.indexOf(TAG) === 0 ? shaderPartLoader(row) : {src: row};
        });

        function shaderPartLoader(row) {
            var loader = {src: null};
            loadShaderSource(row.split(TAG).pop(), function(response) {
                loader.src = response;
                loading.every(function (l) {
                    return l.src !== null;
                }) && onReady(loading.map(function(loader) {
                    return loader.src;
                }).join('\n'));
            });
            return loader;
        }
    }

})();
