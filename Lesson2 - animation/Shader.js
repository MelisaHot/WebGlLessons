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

    static domShaderProgram(gl, vectID, fragID, doValidate){
        //1. get vertex and fragment shader text
        var vShaderTxt = ShaderUtil.domShaderSrc(vectID);   if(!vShaderTxt) return null;
        var fShaderTxt = ShaderUtil.domShaderSrc(fragID);   if(!fShaderTxt) return null;

    //2. cmpile text and validate
        var vShader = ShaderUtil.createShader(gl, vShaderTxt, gl.VERTEX_SHADER);    if(!vShader) return null;
        var fShader = ShaderUtil.createShader(gl, fShaderTxt, gl.FRAGMENT_SHADER);  if(!fShader) return null;

    //3. link the shaders together as a program
    return  ShaderUtil.createProgram(gl, vShader, fShader, true);
    }
}   