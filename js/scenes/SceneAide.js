//Importation des fichiers classes ou fichiers nécessaires
import 
{
	GrilleMontage
} from "../utils/GrilleMontage.js";


/**
 * Class representant la scène d'intro du jeu
 * @extends Phaser.Scene
 */

export class SceneAide extends Phaser.Scene 
{

	constructor() 
	{
		super("SceneAide");


	}

	init() 
	{

	}

	create() 
	{

		//Clic dans l'écran
        this.input.once("pointerdown", this.allerEcranJeu, this);
        
        let leFond = this.add.image(game.config.width / 2, game.config.height / 2, "EcranAide");
        leFond.setOrigin(0.5, 0.5);	//Modifier le point d'ancrage de l'image à son coin supérieur gauche
        leFond.displayWidth = game.config.width;	// Redimensionner le fond relativement aux dimensions de l'ecran 
		leFond.displayHeight = game.config.height;


	}

	update() 
	{

	}


	/**
	 * Fonction pour afficher la consigne et mettrel'écouteur pour débuter le jeu
	 */
	afficherTxt() 
	{
		//Consigne
		let tailleTexte = Math.round(32 * GrilleMontage.ajusterRatioX());
		let consigneTxt = this.add.text(game.config.width / 2, game.config.height, "CLIQUER DANS L'ÉCRAN POUR JOUER", 
		{
			font: `bold ${tailleTexte}px Monospace`,
			color: "#FF0090",
			align: "center"
		});
		consigneTxt.setOrigin(0.5, 2);


	}

	allerEcranJeu() 
	{

        this.scene.start("SceneJeu");
        
	}
}