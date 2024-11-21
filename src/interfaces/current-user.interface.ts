export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  userRoleId: string;
  company: {
    id: string;
    name: string;
  };
}
