import type { SeoData } from '@/lib/seo/types'
import type { Project } from '@/data/projects'

export type ProjectsAnchorMenuItem = {
  id: string
  label: string
}

export type ProjectsPageContentData = {
  banner: {
    title: string
    vimeoBackgroundVideo: string
  }
  anchorMenu: ProjectsAnchorMenuItem[]
  introduction: string
  cta: {
    heading: string
    content: string
    button: string
    buttonLink: string
    videoBackground: string
  }
}

export type ProjectsPageCmsContent = ProjectsPageContentData & {
  seo: SeoData
  projects: Project[]
}

export type ProjectItem = Project & {
  seo: SeoData
}
