export interface EmailContent {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}
