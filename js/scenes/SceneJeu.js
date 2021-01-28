//Importation des fichiers classes ou fichiers nécessaires
import 
{
	GrilleMontage
} from "../utils/GrilleMontage.js";



/**
 * Class representant la scène du jeu comme tel
 */

export class SceneJeu extends Phaser.Scene 
{

	constructor() 
	{
		super("SceneJeu");

		//Propriétés ou objets du jeu
		this.groupePhysique = null; //Groupe physique pour mettre les éléments du jeu
		this.lePersonnage = null; //Le personnage du jeu
		this.leBatiment = null; 
		this.Batiment = null;
		this.tabEnnemis = null;
		this.groupeLocustes = null;
		this.nbLocustesDetruits = null;
		this.secondes = null;
		this.affichageScore = null;

		//Le joystic virtuel
		this.joyStick = null;

		//Les flèches du clavier	
		this.lesfleches = null;

		//La grille pour la mise en page du jeu
		this.grille = null;

		//Vérification d'un meilleur score antérieur enregistré
		game.jeuLocustes.meilleurScore = localStorage.getItem(game.jeuLocustes.NOM_LOCAL_STORAGE) === null ? 0 : localStorage.getItem(game.jeuLocustes.NOM_LOCAL_STORAGE);
	}


/*===================================================================================================================================*/
/*===================================================================================================================================*/


	/**
	 * Fonction d'initialisation des valeurs des propriétés
	 */
	init()
	{
		//Initialiser le score
		game.jeuLocustes.score = 0;
		this.tabEnnemis = ["locuste1", "locuste2", "locuste3"];
		this.nbLocustesDetruits = 0;
		this.secondes = 0;
	}



	/*----------------------------------------------------------------------------------------------------------------------------------*/


	/**
	 * Méthode create pour placer tous les éléments
	 */
	create() 
	{


		//Instancier une grille de montage avec 8 colonnes et 12 rangées
		this.grille = new GrilleMontage(this, 8, 12);


		// DÉCORS -----------------
		let leFond = this.add.image(0, 0, "fondIntro");	//Créer et afficher un objet Image au coins supérieur gauche du canvas
		leFond.setOrigin(0, 0);		//Modifier le point d'ancrage de l'image à son coin supérieur gauche
		leFond.displayWidth = game.config.width;	// Redimensionner le fond relativement aux dimensions de l'ecran 
		leFond.displayHeight = game.config.height;
		leFond.setDepth(-2);


		this.leBatiment = this.physics.add.sprite(game.config.width / 2, game.config.height / 1.05, 'batiment');
		this.leBatiment.setImmovable(true); // Empêcher le bâtiment de tomber
		this.leBatiment.body.allowGravity = false; // Empêcher le bâtiment de tomber

		this.leBatiment.setDisplaySize(this.game.config.width / 1.4, this.game.config.height / 8);
		// this.leBatiment.setSize(this.game.config.width / 1.5, this.game.config.height / 12, (0.5, 0.5));
		this.leBatiment.setOrigin(0.5, 0.5);
		//	------



		// GAMEOBJECTS -----------------
		this.lePersonnage = this.physics.add.sprite(game.config.width / 2, game.config.height / 1.2, 'personnage', 1);		
		GrilleMontage.mettreEchelleRatioX(this.lePersonnage);
		this.lePersonnage.setDisplaySize(game.config.width / 9, game.config.height / 13);

		this.groupeLocustes = this.physics.add.group();

		/**
		 * Fonction qui génère des locustes à répétition constante
		 */
		function locusteGen () 
		{
			let xCoord = Math.random() * this.game.config.width;
			let yCoord = Math.random() * -10;
			let unLocuste = this.groupeLocustes.create(xCoord, yCoord, `${Phaser.Utils.Array.GetRandom(this.tabEnnemis)}`).setOrigin(0.5, 1).setSize(this.game.config.width / 7, this.game.config.height / 30 );
			unLocuste.displayWidth = this.game.config.width / 7;
			unLocuste.displayHeight = this.game.config.height / 30;
			unLocuste.angle = -100;
			unLocuste.setDepth(-1);
			this.id ++;
		  }

		  let locusteGenBoucle = this.time.addEvent(
			  {
			delay: 500,
			callback: locusteGen,
			callbackScope: this,
			loop: true,
		  });



		// --------



		// ANIMATIONS ------------------
        this.anims.create(
			{
            key: 'gauche',
			frames: this.anims.generateFrameNumbers('personnage', { start: 8, end: 11 
			}),
            frameRate: 8,
            repeat: -1
		});
		this.anims.create(
			{
            key: 'idle',
			frames: [{key: 'personnage', frame: 1 }],
            frameRate: 20
        });
		this.anims.create(
			{
            key: 'droite',
            frames: this.anims.generateFrameNumbers('personnage', { start: 4, end: 7 }),
            frameRate: 8,
            repeat: -1
		});
		// --------



		// COLLISIONS ----------------
		this.physics.add.collider(this.lePersonnage, this.leBatiment);
		this.physics.add.collider(this.lePersonnage, this.groupeLocustes, this.contactLocuste, null, this);
		// -------




		// POINTAGE -----------------
		// Affichage du score (durée de survie)
		let tailleTexte = Math.round(85 * GrilleMontage.ajusterRatioX());
		this.affichageScore = this.add.text(game.config.width / 2, game.config.height / 15, Math.trunc(this.secondes / 100),
		{
			font: `bold ${tailleTexte}px Monospace`,
			color: "#FF0090",
			align: "center"
		});
		this.affichageScore.setOrigin(0.5, 0.5);
		// -------



		//Gérer les flèches ou le joystic --- selon qu'on est sur desktop ou mobile
		if (this.sys.game.device.os.desktop === true) 
		{ //Ordinateur de bureau

			// CONTROLS ------------------
			this.lesfleches = this.input.keyboard.createCursorKeys();
			// --------


		} else { //Mobile
			//Dimension et positions du joystic
			let dim = 80 * GrilleMontage.ajusterRatioX();
			let posX = game.config.width / 2;
			let posY =  game.config.height / 1.03;

			this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, 
			{
				x: posX,
				y: posY,
				radius: dim,
				base: this.add.circle(0, 0, dim, 0xFF0090),
				thumb: this.add.circle(0, 0, dim / 2, 0x88c3ff),
				dir: '4dir',
				enable: true
			});

			//Création des flèches virtuelles
			this.lesfleches = this.joyStick.createCursorKeys();
		}

		
		if (!this.sys.game.device.os.desktop === true) 
		{ // Pas un ordinateur de bureau

            this.verifierOrientation();

            this.scale.on('resize', this.verifierOrientation, this);
		}
		

	}




	/**----------------------------------------------------------------------------------------------------------------------------------------- */

	/**
	 * Fonction update
	 */
	update() 
	{


		// COURSE ET SAUTS -------------------------------
		if (this.lesfleches.left.isDown)
		{
			this.lePersonnage.setVelocityX(-300);

			this.lePersonnage.anims.play('gauche', true);
		}
		else if (this.lesfleches.right.isDown)
		{
			this.lePersonnage.setVelocityX(300);

			this.lePersonnage.anims.play('droite', true);
		}
		else
		{
			this.lePersonnage.setVelocityX(0);

			this.lePersonnage.anims.play('idle');
		}

		if (this.lesfleches.up.isDown && this.lePersonnage.body.touching.down)
		{
			this.lePersonnage.setVelocityY(-270);
		}
		// ---------


		// Destruction d'un locuste s'il est trop bas
		for ( const element of this.groupeLocustes.getChildren() )
		{

			if ( element.y >= this.game.config.height * 1.15 ) 
			{
				element.destroy();
			}

		}

		// Si le personnage est trop bas, (s'il tombe), le faire mourrir
		if ( this.lePersonnage.y > 1100 )
		{
			this.allerEcranFinale();
		}

		this.secondes ++;


		this.affichageScore.text = Math.trunc(this.secondes / 100);
			
		
	}


	/**
	 * Vérifier l'orientation, afficher le message d'erreur si l'écran est à l'horizontale
	 */
	verifierOrientation() 
	{

		if (window.orientation === 90 || window.orientation === -90) 
		{
			this.scene.pause(this);
			//On affiche la balise <div>
			document.getElementById("orientation").style.display = "flex";

		} else 
		{
			//On repart le jeu et le son
			this.scene.resume(this);
			// this.sonAmbiance.resume();
			//On enlève l'affichage de la balise <div>
			document.getElementById("orientation").style.display = "none";
		}

	}


	/** Instruction après la collision entre un locuste et le joueur
 	* 
	* @param {*} lePersonnage 
	* @param {*} locuste 
	*/
	contactLocuste (lePersonnage, locuste)
	{
	
		locuste.disableBody(true, true);
		lePersonnage.disableBody(true, true);
		this.allerEcranFinale();

	}

	/**
	 * Le joueur a perdu, aller à l'écran de fin
	 */
	allerEcranFinale() 
	{
		game.jeuLocustes.score = Math.trunc(this.secondes / 100);
		//Aller à l'écran finale du jeu
		this.scene.start("SceneFinale");
	}


}