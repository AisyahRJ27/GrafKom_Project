THREE.UCSCharacter = function() {

	var scope = this;
	
	var mesh;
	var bodyd = [];
	bodyd[0] =  '';
	bodyd[1] = 'Sistem otot adalah sistem organ yang terdiri dari otot rangka, halus dan jantung. Ini memungkinkan pergerakan tubuh, mempertahankan postur, dan mengedarkan darah ke seluruh tubuh. Sistem otot pada vertebrata dikendalikan melalui sistem saraf, meskipun beberapa otot (seperti otot jantung) dapat sepenuhnya otonom. Bersama dengan sistem kerangka itu membentuk sistem muskuloskeletal, yang bertanggung jawab untuk pergerakan tubuh manusia.';
	bodyd[2] = 'Kerangka manusia adalah kerangka internal tubuh. Ini terdiri dari 270 tulang saat lahir - jumlah ini berkurang menjadi 206 tulang pada usia dewasa setelah beberapa tulang menyatu bersama. [1] Massa tulang dalam kerangka mencapai kepadatan maksimum sekitar usia 30 tahun. Kerangka manusia dapat dibagi menjadi kerangka aksial dan kerangka usus buntu. Kerangka aksial dibentuk oleh kolom tulang belakang, tulang rusuk dan tengkorak. Kerangka usus buntu, yang melekat pada kerangka aksial, dibentuk oleh korset dada, korset panggul dan tulang-tulang anggota badan atas dan bawah. ';
	bodyd[3] = 'Sistem saraf adalah bagian dari tubuh hewan yang mengkoordinasikan tindakan sukarela dan tidak sukarela serta mentransmisikan sinyal di antara berbagai bagian tubuhnya. Jaringan saraf pertama kali muncul pada organisme mirip cacing sekitar 550 hingga 600 juta tahun yang lalu. Dalam sebagian besar spesies hewan terdiri dari dua bagian utama, sistem saraf pusat (CNS) dan sistem saraf perifer (PNS) .SNS berisi otak dan sumsum tulang belakang.NSP terutama terdiri dari saraf, yang terikat bundel panjang serat atau akson, yang menghubungkan SSP ke setiap bagian tubuh lainnya.PNS termasuk neuron motorik, mediasi pergerakan sukarela, sistem saraf otonom, yang terdiri dari sistem saraf simpatis dan sistem saraf parasimpatis, yang mengatur fungsi sukarela, dan enterik. sistem saraf, yang berfungsi untuk mengontrol sistem pencernaan. ';
	
	this.scale = 1;
	this.infodis = 0;
	this.root = new THREE.Object3D();
	
	this.numSkins;
	this.numMorphs;
	
	this.skins = [];
	this.materials = [];
	this.morphs = [];

	this.onLoadComplete = function () {};
	
	this.loadCounter = 0;

	this.loadParts = function ( config ) {
		
		this.numSkins = config.skins.length;
		
		// Character geometry + number of skins
		this.loadCounter = 1 + config.skins.length;
		
		// SKINS
		//alert('Welcome to Human Body Anatomy');
		console.log('UCSCharacter loadParts');
		
		//Method tampilan Skin yang disimpan di fileJSON
		this.skins = loadTextures( config.baseUrl + "skins/", config.skins );
		this.materials = createMaterials( this.skins );
		
		
		// CHARACTER
		var loader = new THREE.JSONLoader();
		console.log( config.baseUrl + config.character );
		loader.load( config.baseUrl + config.character, function( geometry ) {
			geometry.computeBoundingBox();
			geometry.computeVertexNormals();

			// THREE.AnimationHandler.add( geometry.animation );

			mesh = new THREE.SkinnedMesh( geometry, new THREE.MeshFaceMaterial() );
			scope.root.add( mesh );
			
			var bb = geometry.boundingBox;
			scope.root.scale.set( config.s, config.s, config.s );
			scope.root.position.set( config.x, config.y - bb.min.y * config.s, config.z );

			mesh.castShadow = true;
			mesh.receiveShadow = true;

			animation = new THREE.Animation( mesh, geometry.animation );
			animation.play();
			
			scope.setSkin(0);
			
			scope.checkLoadComplete();
		} );

	};
	
	//Kondisi untuk menampilkan Info Skin
	this.setSkin = function( index ) {
		if(!this.infodis){
			this.infodis = 1;
		}else{
			$("#info").html(bodyd[index]);
		}
		console.log('UCSCharacter setSkin' + index );
		
		if ( mesh && scope.materials ) {
			mesh.material = scope.materials[ index ];
		}
	};
	
	//Tampilan Skin yang disimpan di fileJSON
	function loadTextures( baseUrl, textureUrls ) {
		console.log('loadTextures UCSCharacter');
		var mapping = THREE.UVMapping;
		var textures = [];

		for ( var i = 0; i < textureUrls.length; i ++ ) {
			textures[ i ] = THREE.ImageUtils.loadTexture( baseUrl + textureUrls[ i ], mapping, scope.checkLoadComplete );

			//Set nama di gui folder Skin
			var name = textureUrls[ i ];
			name = name.replace(/\.jpg/g, "");
			textures[ i ].name = name;
			console.log(textures[ i ].name );
		}
		return textures;
	};

	function createMaterials( skins ) {
		var materials = [];
		console.log('createMaterials UCSCharacter');
		for ( var i = 0; i < skins.length; i ++ ) {
			materials[ i ] = new THREE.MeshLambertMaterial( {
				color: 0xeeeeee,
				specular: 10.0,
				map: skins[ i ],
				skinning: true,
				morphTargets: true,
				wrapAround: true
			} );
		}
		return materials;
	}

	this.checkLoadComplete = function () {
		console.log('checkLoadComplete');
		scope.loadCounter -= 1;
		if ( scope.loadCounter === 0 ) {
			scope.onLoadComplete();
		}
	}
}
