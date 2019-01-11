// tiny webgl lib

function GLx() {

    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    return {
        gl: gl,
        buffer: buffer,
        program: program,
        resize: resize,
        texture: texture
    };

    function program(vs, fs) {
        var pid = gl.createProgram(); // program id
        shader(vs, gl.VERTEX_SHADER);
        shader(fs, gl.FRAGMENT_SHADER);
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
            bind: function () {
                gl.bindTexture(gl.TEXTURE_2D, tex);
            },
            framebuffer: function() {
                if (!fbo) {
                    fbo = {
                        fbo: gl.createFramebuffer(),
                        bind: function () {
                            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
                            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, mipmap);
                        }
                    }
                }
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
        return t
    }

    function resize() {
        var c = canvas;
        if (c.clientWidth !== c.width || c.clientHeight !== c.height) {
            c.width = c.clientWidth;
            c.height = c.clientHeight;
            return true;
        }
    }
}