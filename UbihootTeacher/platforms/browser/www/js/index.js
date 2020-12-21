document.addEventListener('deviceready', function(){
	let user = null;
	let db = null;
    let storageRef = null;
    let fileList = null;

    var taskName;
    
	getRedirectResult();
	document.querySelector('#btn_google_login').addEventListener('click', function(){
		const provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithRedirect(provider).then(()=>{
			getRedirectResult();
		});
	});

	function getRedirectResult(){
		firebase.auth().getRedirectResult().then((result)=>{
			if(result.credential){
                document.querySelector('#page_login').style.display = 'none';
                document.querySelector('#page_main').style.display = 'block';
                
                user = result.user;
                console.log(user);
                
                db = firebase.database();
                storageRef = firebase.storage().ref();
                let root_ref = db.ref();
                let users_ref = db.ref("users");
                
                const page_main = document.querySelector('#page_main');
                //Obtenemos la foto de perfil de la cuenta de google
                let photoURL = user.photoURL;
                var img = document.createElement('img');
                img.src = photoURL;
                img.id = "userPhoto";
                document.body.appendChild(img);
                console.log(user.uid);
                
                let data;
                //Para diferenciar entre los usuarios y solo mostrar sus tareas se emplea el UID, que es único para cada cuenta de google
                root_ref.child("users").child(user.uid).on('child_added', function(child_snapshot, prev_child_key){
                    data = child_snapshot.val();
                    console.log(data);
                    
                    let el = document.createElement('div');
                    el.id = "game";
                    
                    el.innerHTML = "<h2 id='game_name'>" + data.name + "</h2>";
                    el.innerHTML += "<p id='game_name'>" + data.description + "</p>";
                    el.innerHTML += "<button class='delete_game'> X </button>";
                    el.innerHTML += "<button class='edit_game'> Edit </button>";
                    el.innerHTML += "<button class='start_game'> Start </button>";
                    
                    page_main.appendChild(el);
                    
                    //Se aplican las acciones al botón de eliminar
                    document.querySelectorAll('.delete_game').forEach(item => {
                        item.addEventListener('click', event => {
                            var root_ref = db.ref();

                            var parent = item.parentElement;
                            root_ref.child('users').child(user.uid).orderByChild('name').equalTo(parent.children[0].innerHTML).on("value", function(snapshot) {
                                snapshot.forEach(function(child) {
                                    console.log(child.key);
                                    root_ref.child('users').child(user.uid).child(child.key).remove();
                                    
                                    var photoRef = storageRef.child('users/' + user.uid + '/' + child.key);

                                    // Delete the file
                                    photoRef.delete().then(function() {
                                        // File deleted successfully
                                        console.log("Fotos asociadas eliminadas");
                                    }).catch(function(error) {
                                        console.log(child.key + " no tenía fotos asociadas");
                                    });

                                });
                            });
                            item.parentElement.remove();
                        })
                    })
                    
                    //Se aplican las acciones al botón de editar
                    document.querySelectorAll('.edit_game').forEach(item => {
                        item.addEventListener('click', event => {
                            var parent = item.parentElement;
                            var game_old_nm = parent.children[0].innerHTML;
                            var game_old_desc = parent.children[1].innerHTML;
                            
                            document.querySelector('#page_edit_game').style.display = "block";
                            document.querySelector('#page_main').style.display = "none";
                            
                            document.getElementById("game_nm_edit").defaultValue = game_old_nm;
                            document.getElementById("game_desc_edit").defaultValue = game_old_desc;
                        })
                    })
                    
                    //Se aplican las acciones al botón de editar
                    document.querySelectorAll('.start_game').forEach(item => {
                        item.addEventListener('click', event => {
                            var root_ref = db.ref();

                            var parent = item.parentElement;
                            root_ref.child('users').child(user.uid).orderByChild('name').equalTo(parent.children[0].innerHTML).on("value", function(snapshot) {          
                                snapshot.forEach(function(child) {
                                    
                                    var startGame = root_ref.child('users').child(user.uid);
                                    startGame.update(
                                        {
                                            actual_game: child.key
                                        }
                                    );
                                    
                                                                        
                                    var qrInfo = user.uid + "|" + child.key;
                                    console.log(qrInfo);
                                    
                                    showQR(qrInfo);
                            
                                });
                            });
                        })
                    })
                    
                    
                })
                    
            }
		}).catch((error)=>{
			console.log(error);
		});
	}
	
	function showQR(qrInfo) {
        cordova.plugins.qrcodejs.encode('TEXT_TYPE', qrInfo, (base64EncodedQRImage) => {
            console.log('QRCodeJS response is ' + base64EncodedQRImage);
            //TODO: use your base64EncodedQRImage
            
            let page_start = document.querySelector('#page_start_game');
            var img = document.getElementById('qr');
            img.src = base64EncodedQRImage;
            
            page_start.appendChild(img);
        }, (err) => {
            console.error('QRCodeJS error is ' + JSON.stringify(err));
        });
        
        document.querySelector('#page_start_game').style.display = "block";
        document.querySelector('#page_main').style.display = "none";
    }
	
    document.querySelector('#btn_add_game').addEventListener('click',function(){
		document.querySelector('#page_add_game').style.display = "block";
		document.querySelector('#page_main').style.display = "none";
	});
    
    document.querySelector('#btn_cancel_add').addEventListener('click',function(){
		document.querySelector('#page_add_game').style.display = "none";
		document.querySelector('#page_main').style.display = "block";
	});
    
    document.querySelector('#btn_addquest_add').addEventListener('click',function(){
        const page_add_game = document.querySelector('#page_add_game');

        var iTags = document.getElementsByTagName("input");
        
        let el = document.createElement('div');
        el.classList.add('questcuatro');
        
        el.innerHTML = "<div> <label for='quest_nm_edit'>Pregunta</label> <input type='text' id='quest_nm_edit' name='quest_nm_edit' /> </div>";
        el.innerHTML += "<button class='delete_quest'> X </button>";
        el.innerHTML += "<div> <input type='radio' id='opt1' name='" + "quest" + iTags.length + "' value='Option1' checked> <input type='text' id='quest_op1_edit' name='quest_opt1_edit'/> </div>";
        el.innerHTML += "<div> <input type='radio' id='opt2' name='" + "quest" + iTags.length + "' value='Option2'> <input type='text' id='quest_op2_edit' name='quest_opt2_edit'/> </div>";
        el.innerHTML += "<div> <input type='radio' id='opt3' name='" + "quest" + iTags.length + "' value='Option3'> <input type='text' id='quest_op3_edit' name='quest_opt3_edit'/> </div>";
        el.innerHTML += "<div> <input type='radio' id='opt4' name='" + "quest" + iTags.length + "' value='Option4'> <input type='text' id='quest_op4_edit' name='quest_opt4_edit'/> </div>";
        
        el.innerHTML += "<p> Imagen: </p>";
        el.innerHTML += "<input type='file' id='file-selector' accept='.jpg, .jpeg, .png'>";
                    
        el.innerHTML += "<p> Tipo de pregunta: </p>";
        el.innerHTML += "<div class='quest-select'> <select> <option value='0'>4 opciones</option> <option value='1'>2 opciones</option> <option value='2'>Respuesta abierta</option> </select> </div>";
        
        page_add_game.appendChild(el);
        
        document.querySelectorAll('#file-selector').forEach(item => {
            item.addEventListener('change', (event) => {
                fileList = event.target.files;
            });
        });
        
        document.querySelectorAll('.quest-select').forEach(item => {
            item.addEventListener('change', (event) => {
                console.log(event.target.value);
                
                if(event.target.value == 0) {
                    let el = item.parentElement;
                    
                    el.classList.remove('questo');
                    el.classList.remove('questdos');
                    el.classList.add('questcuatro');
        
                    el.innerHTML = "<div> <label for='quest_nm_edit'>Pregunta</label> <input type='text' id='quest_nm_edit' name='quest_nm_edit' /> </div>";
                    el.innerHTML += "<button class='delete_quest'> X </button>";
                    el.innerHTML += "<div> <input type='radio' id='opt1' name='" + "quest" + iTags.length + "' value='Option1' checked> <input type='text' id='quest_op1_edit' name='quest_opt1_edit'/> </div>";
                    el.innerHTML += "<div> <input type='radio' id='opt2' name='" + "quest" + iTags.length + "' value='Option2'> <input type='text' id='quest_op2_edit' name='quest_opt2_edit'/> </div>";
                    el.innerHTML += "<div> <input type='radio' id='opt3' name='" + "quest" + iTags.length + "' value='Option3'> <input type='text' id='quest_op3_edit' name='quest_opt3_edit'/> </div>";
                    el.innerHTML += "<div> <input type='radio' id='opt4' name='" + "quest" + iTags.length + "' value='Option4'> <input type='text' id='quest_op4_edit' name='quest_opt4_edit'/> </div>";
                    
                    el.innerHTML += "<p> Imagen: </p>";
                    el.innerHTML += "<input type='file' id='file-selector' accept='.jpg, .jpeg, .png'>";
                    
                    el.innerHTML += "<p> Tipo de pregunta: </p>";
                    el.innerHTML += "<div class='quest-select'> <select> <option value='0'>4 opciones</option> <option value='1'>2 opciones</option> <option value='2'>Respuesta abierta</option> </select> </div>";
                    
                    page_add_game.appendChild(el);
                    
                    document.querySelectorAll('#file-selector').forEach(item => {
                        item.addEventListener('change', (event) => {
                            fileList = event.target.files;
                        });
                    });
                    
                } else if (event.target.value == 1) {
                    let el = item.parentElement;
                    
                    el.classList.remove('questcuatro');
                    el.classList.remove('questo');
                    el.classList.add('questdos');
        
                    el.innerHTML = "<div> <label for='quest_nm_edit'>Pregunta</label> <input type='text' id='quest_nm_edit' name='quest_nm_edit' /> </div>";
                    el.innerHTML += "<button class='delete_quest'> X </button>";
                    el.innerHTML += "<div> <label for='Si'> Sí </label> <input type='radio' id='opt1' name='" + "quest" + iTags.length + "' value='Si' checked> </div>";
                    el.innerHTML += "<div> <label for='No'> No </label> <input type='radio' id='opt2' name='" + "quest" + iTags.length + "' value='No'> </div>";
                    
                    el.innerHTML += "<p> Imagen: </p>";
                    el.innerHTML += "<input type='file' id='file-selector' accept='.jpg, .jpeg, .png'>";
                    
                    el.innerHTML += "<p> Tipo de pregunta: </p>";
                    el.innerHTML += "<div class='quest-select'> <select> <option value='0'>4 opciones</option> <option value='1'>2 opciones</option> <option value='2'>Respuesta abierta</option> </select> </div>";
                    
                    page_add_game.appendChild(el);
                    
                    document.querySelectorAll('#file-selector').forEach(item => {
                        item.addEventListener('change', (event) => {
                            fileList = event.target.files;
                        });
                    });
                    
                } else if (event.target.value == 2) {
                    let el = item.parentElement;
                    
                    el.classList.remove('questdos');
                    el.classList.remove('questcuatro');
                    el.classList.add('questo');
        
                    el.innerHTML = "<div> <label for='quest_nm_edit'>Pregunta</label> <input type='text' id='quest_nm_edit' name='quest_nm_edit' /> </div>";
                    el.innerHTML += "<button class='delete_quest'> X </button>";
                    el.innerHTML += "<div> <label for='quest_res_edit'>Respuesta</label> <input type='text' id='quest_res_edit' name='quest_res_edit' /> </div>";
                    
                    el.innerHTML += "<p> Imagen: </p>";
                    el.innerHTML += "<input type='file' id='file-selector' accept='.jpg, .jpeg, .png'>";
                    
                    el.innerHTML += "<p> Tipo de pregunta: </p>";
                    el.innerHTML += "<div class='quest-select'> <select> <option value='0'>4 opciones</option> <option value='1'>2 opciones</option> <option value='2'>Respuesta abierta</option> </select> </div>";
                    
                    page_add_game.appendChild(el);
                    
                    document.querySelectorAll('#file-selector').forEach(item => {
                        item.addEventListener('change', (event) => {
                            fileList = event.target.files;
                        });
                    });
                    
                }
            });
        });
    
	});
    
    document.querySelector('#btn_done_add').addEventListener('click',function(){
        var root_ref = db.ref();
        var game_nm = document.getElementById("game_nm").value;
        var game_desc = document.getElementById("game_desc").value;
        
        var qTags = document.querySelectorAll(".questcuatro, .questdos, .questo");
        console.log(qTags);

        var newChildRef = firebase.database().ref('users/' + user.uid).push();
        var key = newChildRef.key;
        newChildRef.set(
            {
                name: game_nm,
                description: game_desc
            }
        );
                
        for (var i = 0; i < qTags.length; i++) {
                
            if (qTags[i].classList.contains('questcuatro')) {
                let titleQuest = qTags[i].children[0].children[1].value;
                let sol = null;
                
                let opt1 = qTags[i].children[2].children[1].value;
                if(qTags[i].children[2].children[0].checked) sol = qTags[i].children[2].children[1].value;
                let opt2 = qTags[i].children[3].children[1].value;
                if(qTags[i].children[3].children[0].checked) sol = qTags[i].children[3].children[1].value;
                let opt3 = qTags[i].children[4].children[1].value;
                if(qTags[i].children[4].children[0].checked) sol = qTags[i].children[4].children[1].value;
                let opt4 = qTags[i].children[5].children[1].value;
                if(qTags[i].children[5].children[0].checked) sol = qTags[i].children[5].children[1].value;
                
                var gameRef = firebase.database().ref('users/' + user.uid + "/" + key).push();
                var key2 = gameRef.key;
                gameRef.set(
                    {
                        type: "4options",
                        option1: opt1,
                        option2: opt2,
                        option3: opt3,
                        option4: opt4,
                        solution: sol,
                        title: titleQuest
                    }
                );
                
                
                const toBase64 = file => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });

                async function Main(file) {
                    console.log(await toBase64(file));
                    const result = await toBase64(file).catch(e => Error(e));
                    
                    storageRef.child("users").child(user.uid).child(key).child(key2).putString(result, 'data_url').then(function(snapshot) {
                        console.log('Uploaded a base64 string!');
                    });
                }

                Main(fileList[0]);
                
                
            } else if(qTags[i].classList.contains('questdos')) {
                let titleQuest = qTags[i].children[0].children[1].value;
                let sol = null;
                
                //Option1 yes                
                if(qTags[i].children[2].children[0].checked) sol = qTags[i].children[2].children[1].value;
                //Option2 no
                if(qTags[i].children[3].children[0].checked) sol = qTags[i].children[3].children[1].value;
                
                root_ref.child("users").child(user.uid).child(key).push().set(
                    {
                        type: "2options",
                        solution: sol,
                        title: titleQuest
                    }
                );
            }  else if(qTags[i].classList.contains('questo')) {
                let titleQuest = qTags[i].children[0].children[1].value;
                let sol = qTags[i].children[2].children[1].value;
                
                root_ref.child("users").child(user.uid).child(key).push().set(
                    {
                        type: "open",
                        solution: sol,
                        title: titleQuest
                    }
                );
            }
        }
        
        document.querySelector('#page_add_game').style.display = "none";
        document.querySelector('#page_main').style.display = "block";
	});
    
    document.querySelector('#btn_cancel_edit').addEventListener('click',function(){
        document.querySelector('#page_edit_game').style.display = "none";
        document.querySelector('#page_main').style.display = "block";
	});
    
    document.querySelector('#btn_done_edit').addEventListener('click',function(){
        var root_ref = db.ref();

        //Obtenemos el valor anterior y lo ponemos como valor por defecto del campo de texto
        console.log("Valor antiguo: " + document.getElementById("game_nm_edit").defaultValue);
        console.log("Valor nuevo: " + document.querySelector("#game_nm_edit").value);
        var game_old_nm = document.getElementById("game_nm_edit").defaultValue
        var game_new_nm = document.querySelector("#game_nm_edit").value;
        
        var game_old_desc = document.getElementById("game_desc_edit").defaultValue
        var game_new_desc = document.querySelector("#game_desc_edit").value;
        
        //Se actualiza el valor de la tarea correcta
        root_ref.child('Users').child(user.uid).orderByChild('name').equalTo(document.getElementById("game_nm_edit").defaultValue).on("value", function(snapshot) {
            snapshot.forEach(function(child) {
                console.log(child.key);
                root_ref.child('users').child(user.uid).child(child.key).update(
                    {
                        name: game_new_nm,
                        description: game_new_desc
                    }
                );
            })
        });
        
        document.querySelector('#page_edit_game').style.display = "none";
        document.querySelector('#page_main').style.display = "block";
        
        //Actualizamos el nombre del juego en la página principal
        var hTags = document.getElementsByTagName("h2");
        var found;

        for (var i = 0; i < hTags.length; i++) {
            if (hTags[i].textContent == game_old_nm) {
                found = hTags[i];
                break;
            }
        }
        
        found.innerHTML = game_new_nm;
        
        //Actualizamos la descripcion del juego en la página principal
        var pTags = document.getElementsByTagName("p");
        var found;

        for (var i = 0; i < pTags.length; i++) {
            if (pTags[i].textContent == game_old_desc) {
                found = pTags[i];
                break;
            }
        }
        
        found.innerHTML = game_new_desc;
	});
    
    document.querySelector('#btn_addquest_edit').addEventListener('click',function(){
        
        
	});
    
    //Evitamos editar tareas en blanco
    document.querySelector('#game_nm_edit').addEventListener('keyup', function(){
        if(this.value==="") { 
            document.getElementById('btn_done_edit').disabled = true;
        } else {
            document.getElementById('btn_done_edit').disabled = false;
        }
    });
    
    document.querySelector('#btn_finish_game').addEventListener('click',function(){
        var startGame = firebase.database().ref('users/' + user.uid + "/");
        startGame.update(
            {
                actual_game: null
            }
        );
        
        document.querySelector('#page_start_game').style.display = "none";
        document.querySelector('#page_main').style.display = "block";
	});
    
});
