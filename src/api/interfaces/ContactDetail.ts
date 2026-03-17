export default class ContactDetail {
  id: number;
  label: string;
  value: string;
  type: 'phone'|'email'|'whatsapp'|'telegram'|'instagram'|'vkontakte'|'facebook'|'skype'|string;
}
