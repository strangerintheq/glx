// tiny webgl lib
function GLx(params) {
    let started = new Date().getTime();
    var glx = params || {};
    glx.canvas = glx.canvas || document.createElement('canvas');
    glx.ctx = glx.ctx || glx.canvas.getContext('webgl') || glx.canvas.getContext('experimental-webgl');
    var canvas = glx.canvas;
    var gl = glx.ctx;
    glx.buffer = buffer;
    glx.program = program;
    glx.texture = texture;
    glx.buffer = buffer;
    glx.shader = loadShaderCode;

    glx.resize =  function (w, h) {
        w = w || canvas.clientWidth;
        h = h || canvas.clientHeight;
        canvas.width = canvas.width !== w ? w : canvas.width;
        canvas.height = canvas.height !== h ? h : canvas.height;
        return glx;
    };

    glx.draw = function (vertexCount) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.clearColor(0, 0, 0, 1);
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    };

    glx.time = function() {
        return (new Date().getTime() - started) / 1000;
    };

    glx.meshes = {
        FULL_SCREEN_TRIANGLE: [-1,  3, -1, -1, 3, -1]
    };

    return glx;

    function loadShaderCode(name, url, onLoad) {
        glx.shaderLib = glx.shaderLib || {};
        if (glx.shaderLib[name]) {
            onLoad && onLoad(glx.shaderLib[name]);
        } else {
            glx.shaderLib[name] = null;
            req(url, function (response) {
                glueShader(response, function (code) {
                    glx.shaderLib[name] = code;
                    onLoad && onLoad(code);
                    if (Object.keys(glx.shaderLib).every(function (key) {
                        return glx.shaderLib[key];
                    }) && glx.shadersLoadCallback ) {
                        glx.shadersLoadCallback();
                        glx.shadersLoadCallback = null;
                    }
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

    function program(vs, fs) {
        var pid = gl.createProgram(); // program id
        pid.fs = fs;
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
        return {
            set: function (uniformLocation, index) {
                gl.activeTexture(gl.TEXTURE0 + index);
                gl.bindTexture(gl.TEXTURE_2D, tex);
                uniformLocation.set(index);
            },
            renderTo: function(width, height, vertexCount) {
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texImage2D(gl.TEXTURE_2D, mipmap || 0, gl.RGBA, width, height,
                    0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.bindFramebuffer(gl.FRAMEBUFFER, gl.createFramebuffer());
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D,
                    tex, mipmap || 0);
                glx.resize(width, height).draw(vertexCount);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            }
        };
    }
}