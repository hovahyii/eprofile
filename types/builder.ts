export interface ComponentData {
    id: string;
    type: 'profile' | 'projects' | 'contact' | 'social' | 'jobScope' | 'aboutMe';
    props: ProfileProps | { projects: ProjectProps[] } | SocialProps | JobScopeProps | AboutMeProps;
  }
  
  export interface ProfileProps {
    name: string;
    title: string;
    location: string;
    imageUrl: string;
    status: boolean;
  }
  
  export interface ProjectProps {
    title: string;
    description: string;
    status: 'on-going' | 'completed';
    tags: string[];
    technologies: string[];
    logo?: string;
  }
  
  export interface SocialProps {
    links: {
      platform: 'facebook' | 'linkedin' | 'twitter' | 'instagram';
      url: string;
    }[];
  }
  
  export interface JobScopeProps {
    title: string;
    description: string;
  }
  
  export interface AboutMeProps {
    content: string;
  }
  
  export interface EditableComponentProps<T> {
    data: T;
    onUpdate: (newData: T) => void;
  }
  