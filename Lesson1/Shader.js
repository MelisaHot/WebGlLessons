class ShaderUtil{
    static domShaderSrc(elmID){
        var elm = document.getElementById(elmID);
        if(!elm || elm.text == ""){console.log(elmID + "shader not found or no text."); return null;}
        return elm.text;
    }

    static createShader(gl, src, type){
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl. compileShader(shader);

        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            console.error("Error compiling shader: " +src, gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    static createProgram(gl, vShader, fShader, doValidate){
        // link shader together
        var prog = gl.createProgram();
        gl.attachShader(prog, vShader);
        gl.attachShader(prog, fShader);
        gl.linkProgram(prog);

        //check if successfull
        if(!gl.getProgramParameter(prog, gl.LINK_STATUS)){
            console.log("error creating shader program.", gl.getParamInfoLog(prog));
            gl.deleteProgram(prog);
            return null;
        }

        if(doValidate){
            gl.validateProgram(prog);
            if(!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)){
                console.log("error validating program", gl.getProgramInfoLog(prog));
                gl.deleteProgram(prog);
                return null;
            }
        }

        return prog;
    }
}   