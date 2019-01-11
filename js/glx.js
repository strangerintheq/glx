// tiny webgl lib

function GLx(params) {
    var glx = init(params);
    var canvas = glx.canvas;
    var gl = glx.ctx;
    glx.buffer = buffer;
    glx.program = program;
    glx.resize = resize;
    glx.texture = texture;
    glx.buffer = buffer;
    glx.draw = draw;
    glx.shader = loadShaderCode;
    glx.onLoad = onLoad;
    glx.meshes = {
        FULL_SCREEN_TRIANGLE: [-1,  3, -1, -1, 3, -1]
    };
    return glx;

    function onLoad(func) {
        glx.shadersLoadCallback = func;
        return glx;
    }

    function init(params) {
        params = params || {};
        params.canvas = params.canvas || document.createElement('canvas');
        params.ctx = params.ctx || params.canvas.getContext('webgl') || params.canvas.getContext('experimental-webgl');
        return params;
    }

    function loadShaderCode(name, url, onLoad) {
        glx.shaderLib = glx.shaderLib || {};
        if (glx.shaderLib[name]) {
            onLoad && onLoad(glx.shaderLib[name]);
        } else {
            req(url, function (response) {
                glueShader(response, function (code) {
                    glx.shaderLib[name] = code;
                    onLoad && onLoad(code);
                    glx.shadersLoadCallback && glx.shadersLoadCallback();
                });
            });
        }
        return glx;

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
                var url = row.split(TAG).pop();
                loadShaderCode(url, url, function(response) {
                    loader.src = '\n//////\n// ' + url + '\n//////\n' + response + '\n//====';
                    loading.every(function (l) {
                        return l.src !== null;
                    }) && onReady(loading.map(function(loader) {
                        return loader.src;
                    }).join('\n'));
                });
                return loader;
            }
        }
    }

    function draw(vertexCount) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(0, 0, 0, 1);
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }

    function program(vs, fs) {
        var pid = gl.createProgram(); // program id
        shader(glx.shaderLib[vs], gl.VERTEX_SHADER);
        shader(glx.shaderLib[fs], gl.FRAGMENT_SHADER);
        gl.linkProgram(pid);
        var p = {
            uniform: uniform,
            attribute: attribute,
            use: use
        };
        return p;

        function use() {
            gl.useProgram(pid);
            return p;
        }

        function attribute(name, count) {
            var al = gl.getAttribLocation(pid, name);
            return {
                bind: function (buffer) {
                    buffer.bind();
                    gl.vertexAttribPointer(al, count, gl.FLOAT, false, 0, 0);
                    gl.enableVertexAttribArray(al);
                    return p;
                }
            };
        }

        function uniform(type, name) {
            var ul = gl.getUniformLocation(pid, name);
            return {
                set: function (v1, v2, v3, v4) {
                    if (Array.isArray(v1)) {
                        gl['uniform' + type](ul, v1[0], v1[1], v1[2], v1[3]);
                    } else{
                        gl['uniform' + type](ul, v1, v2, v3, v4);
                    }
                }
            };
        }

        function shader(src, type) {
            var sid = gl.createShader(type);
            gl.shaderSource(sid, src);
            gl.compileShader(sid);
            var message = gl.getShaderInfoLog(sid);
            gl.attachShader(pid, sid);
            if (message.length > 0) {
                console.log(src.split('\n').map(function (str, i) {
                    return ("" + (1 + i)).padStart(4, "0") + ": " + str
                }).join('\n'));
                throw message;
            }
        }
    }

    function buffer(data) {
        var array = new Float32Array(data);
        var buffer = gl.createBuffer();
        var type = gl.ARRAY_BUFFER;
        gl.bindBuffer(type, buffer);
        gl.bufferData(type, array, gl.STATIC_DRAW);
        gl.bindBuffer(type, data = null);
        return {
            bind: function () {
                gl.bindBuffer(type, buffer);
            }
        };
    }

    function texture(mipmap) {
        var tex = gl.createTexture();
        mipmap = mipmap || 0;
        var fbo;
        let t = {
            tex: tex,
            bind: function () {
                gl.bindTexture(gl.TEXTURE_2D, tex);
                return t;
            },
            framebuffer: function() {
                if (!fbo) fbo = {
                    fbo: gl.createFramebuffer(),
                    bind: function () {
                        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
                        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, mipmap);
                    }
                };
                return fbo;
            },
            resize: function (width, height) {
                gl.texImage2D(gl.TEXTURE_2D, mipmap, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                return t;
            }
        };
        return t;
    }

    function resize(w, h) {
        var c = canvas;
        if (w && h && (c.width !== w || c.height !== h)) {
            c.width = w;
            c.height = h;
        } else if (c.clientWidth !== c.width || c.clientHeight !== c.height) {
            c.width = c.clientWidth;
            c.height = c.clientHeight;
        }
        return glx;
    }
}