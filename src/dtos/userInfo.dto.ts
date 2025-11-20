export interface UserInfoDto {
  id: string;
  email: string;
  name: string;
  userType: {
    id: string;
    typeName: string;
    // Add other fields related to userType if necessary
  };
}
