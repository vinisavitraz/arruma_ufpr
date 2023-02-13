import { UsersPageContent } from "src/dashboard/content/users-page.content";

export class SearchUsersRequestDTO {

  userId: number | undefined;
  userName: string | undefined;
  userEmail: string | undefined;
  userRole: number | undefined;
  skip: number | null;
  maxPerPage: number | null;

  public static fromPageContent(usersPageContent: UsersPageContent): SearchUsersRequestDTO {
    const searchUsersRequestDTO: SearchUsersRequestDTO = new SearchUsersRequestDTO();

    searchUsersRequestDTO.userId = usersPageContent.userId;
    searchUsersRequestDTO.userName = usersPageContent.userName;
    searchUsersRequestDTO.userEmail = usersPageContent.userEmail;
    searchUsersRequestDTO.userRole = usersPageContent.userRole;
    searchUsersRequestDTO.skip = usersPageContent.skip;
    searchUsersRequestDTO.maxPerPage = usersPageContent.maxPerPage;

    return searchUsersRequestDTO;

  }

}