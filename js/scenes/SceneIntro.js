//Importation des fichiers classes ou fichiers nécessaires
import 
{
	GrilleMontage
} from "../utils/GrilleMontage.js";


/**
 * Class representant la scène d'intro du jeu
 * @extends Phaser.Scene
 */

export class SceneIntro extends Phaser.Scene 
{

	constructor() 
	{
		super("SceneIntro");
		this.tabEnnemis = null;
		this.groupeLocustes = null;
		this.nbLocustesDetruits = null;

	}

	init() 
	{
		this.tabEnnemis = ["locuste1", "locuste2", "locuste3"];
		this.nbLocustesDetruits = 0;
	}

	create() 
	{


		// SONS
		this.musique = this.sound.add("musiqueFond", 
		{
			volume: 1
		});

		this.physics.world.gravity.y = 50;



		let leFond = this.add.image(game.config.width / 2, game.config.height / 1.5, "fondIntro");	//Créer et afficher un objet Image au coins supérieur gauche du canvas
		leFond.setOrigin(.5, .5);	//Modifier le point d'ancrage de l'image à son coin supérieur gauche
		leFond.displayWidth = game.config.width * 1.5;	// Redimensionner le fond relativement aux dimensions de l'ecran 
		leFond.displayHeight = game.config.height * 1.5;


		this.groupeLocustes = this.physics.add.group();

		function locusteGen ()
		{

			let xCoord = Math.random() * this.game.config.width + this.game.config.width * 1.5;
			let yCoord = Math.random() * this.game.config.height / 2;
			let unLocuste = this.groupeLocustes.create(xCoord, yCoord, `${Phaser.Utils.Array.GetRandom(this.tabEnnemis)}`).setOrigin(0.5, 1);
			unLocuste.displayWidth = this.game.config.width / 5;
			unLocuste.displayHeight = this.game.config.height / 25;
			unLocuste.angle = -30;
			unLocuste.setVelocityX(-1.5 * this.game.config.width / 2);

		}

		let locusteGenBoucle = this.time.addEvent(
		{
			delay: 100,
			callback: locusteGen,
			callbackScope: this,
			loop: true,
		});


	}

	update() 
	{

		for ( const element of this.groupeLocustes.getChildren() )
		{

			if ( element.y >= this.game.config.height * 1.15 || element.x <= -element.displayWidth ) 
			{
				element.destroy();
				this.nbLocustesDetruits ++;
			}

		}

		if (this.nbLocustesDetruits === 1)
		{
			this.afficherTxt();
		}
		else 
		{
			return;
		}

	}


	/**
	 * Fonction pour afficher la consigne et mettrel'écouteur pour débuter le jeu
	 */
	afficherTxt() 
	{
		//Consigne
		let tailleTexte = Math.round(17 * GrilleMontage.ajusterRatioX());
		let consigneTxt = this.add.text(game.config.width / 2, game.config.height, "CLIQUER DANS L'ÉCRAN POUR JOUER", 
		{ 
			fontFamily: '"Heroes Legend", "Times New Roman"', fontSize: tailleTexte, color: '#FF0090'
		});

		consigneTxt.setOrigin(0.5, 2);

		//Clic dans l'écran
		this.input.once("pointerdown", this.allerEcranAide, this);
		
		// Titre du jeu
		let titreJeu = this.add.text(game.config.width / 2, game.config.height / 2, "LOCUSTES EN \n MÉTROPOLE !", 
		{
			fontFamily: 'Heroes Legend', fontSize: tailleTexte * 2, color: '#FF0090'
		});
		titreJeu.setOrigin(0.5, 2);

	}

	allerEcranAide()
	{
		//Aller à l'écran de jeu
		this.groupeLocustes.destroy();
		this.musique.play({
			loop: true,
			volume: 0.7
			});
		this.scene.start("SceneAide");
	}
}