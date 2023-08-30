import fetchData from "@/lib/fetch/fetchData";
import { StoryUpdate } from "@transcendence/shared/types/Story.types";

export default class StoryService {
  private token?: string;

  constructor(token?: string) {
    if (token) this.token = token;
  }

  //Recupere la liste des game en cours
  public async getUserStories(userId: number): Promise<ReturnData | undefined> {
    try {
      const response = await fetchData(
        this.token,
        "story",
        `get/${userId}`,
        "GET"
      );
      const data: ReturnData = await response.json();
      return data;
    } catch (error) {
      console.log(`Error Getting User Stories: ${error}`);
    }
  }

  public async updateStory(userId: number, update: StoryUpdate): Promise<void> {
    const body = JSON.stringify(update);
    await fetchData(this.token, "story", `update/${userId}`, "PUT", body);
  }
}
