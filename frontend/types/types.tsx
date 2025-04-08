export interface Youtubeinfo {
    thumbnail: string;
    title: string;
    link: string;
}

export interface Dayinfo {
  id: number;
  year: number;
  month: number;
  day: number;
  student: string;
  music_url: string;
}

export interface CalendarDatasProps {
    morningMusic : {
      curruntMonth : Dayinfo[]
      nextMonth : Dayinfo[]
    }
    workMusic : {
      curruntMonth : Dayinfo[]
      nextMonth : Dayinfo[]
    }
}