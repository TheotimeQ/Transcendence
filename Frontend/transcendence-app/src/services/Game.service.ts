import { useRouter } from "next/navigation";

class Game_Service {

    private static instance : Game_Service;
    private token: string;
    private router = useRouter();
  
    constructor(token: any) {
        this.token = token;
        if (Game_Service.instance) {
            return Game_Service.instance;
        }
        Game_Service.instance = this;
    }
  
    //Fait une requette et renvoie la reponse
    public async FetchData(url : string , methode : string, body : any = null){
        const response = await fetch('http://localhost:4000/api/' + url , {
            method: methode,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + this.token
            },
            body : body
        });

        if (!response.ok)
            throw new Error("connexion refused");  
            
        return response;
    }

    //Recupere l'etat du joueur ( in game or not )
    public async IsInGame(): Promise<any> {

        const response = await this.FetchData('games/isingame' , 'GET');
        if (response.status === 200) {

            const data = await response.json();
            if (data.success === true) {
                return data.data.id
            };
            if (data.success === false) {
                return false;
            }
        }
        return false;
    }   

    //Fonction de test qui console log un message
    public Test(): void {
        console.log("Game service test");
    }

    //Creer une game avec un nom et un mot de passe
    public async Create_Game(game_password: string, game_name: string): Promise<any> {
        const body = JSON.stringify({ game_password, game_name })
        const response = await this.FetchData('games/create' , 'POST', body);
        const data = await response.json();
        const url = 'home/game/' + data.data.id;
        this.router.push(url);
    }   
    
    //Reprendre la partie en cours
    public async Resume_Game(gameID : string): Promise<any> {
        const url = 'home/game/' + gameID;
        this.router.push(url);
    }

    //Quit la partie en cours
    public async Quit_Game(): Promise<any> {
        await this.FetchData('games/quit' , 'POST');
    }

    //Recupere la liste des game en cours
    public async Get_Game_List(): Promise<any> {
        const response = await this.FetchData('games/getall' , 'GET');
        const data = await response.json();
        // if (data.success === false)
        //     return data;
        return data.data;
    }
}

export default Game_Service;
