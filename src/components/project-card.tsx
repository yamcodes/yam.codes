import Image from "next/image"
import { Card, CardContent, CardFooter } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { ExternalLink, Github, FileText } from "lucide-react"

interface Project {
  title: string
  description: string
  image: string
  tags: string[]
  links: {
    live?: string
    github?: string
    docs?: string
  }
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full">
        <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
      </div>
      <CardContent className="flex-1 p-6">
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-muted-foreground mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0 flex flex-wrap gap-2">
        {project.links.live && (
          <Button size="sm" variant="outline" asChild>
            <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <ExternalLink size={16} />
              <span>Live</span>
            </a>
          </Button>
        )}
        {project.links.github && (
          <Button size="sm" variant="outline" asChild>
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <Github size={16} />
              <span>Code</span>
            </a>
          </Button>
        )}
        {project.links.docs && (
          <Button size="sm" variant="outline" asChild>
            <a href={project.links.docs} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <FileText size={16} />
              <span>Docs</span>
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

