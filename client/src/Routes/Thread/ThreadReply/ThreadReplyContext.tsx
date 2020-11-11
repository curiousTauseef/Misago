import React from "react"
import { FormContextValues, useForm } from "react-hook-form"
import * as Yup from "yup"
import { useSettingsContext } from "../../../Context"

interface IThreadReplyFormValues {
  markup: string
}

interface IThreadReplyPost {
  id: string
}

export interface IThreadReplyContext {
  isActive: boolean
  fullscreen: boolean
  minimized: boolean
  mode: string
  post: IThreadReplyPost | null
  form: FormContextValues<IThreadReplyFormValues>
  startReply: () => void
  editReply: (post: IThreadReplyPost) => void
  cancelReply: () => void
  setFullscreen: (state: boolean) => void
  setMinimized: (state: boolean) => void
}

const ThreadReplyContext = React.createContext<IThreadReplyContext | null>(
  null
)

interface IThreadReplyProviderProps {
  active?: boolean
  mode?: string
  children: React.ReactNode
}

const ThreadReplyProvider: React.FC<IThreadReplyProviderProps> = (props) => {
  const { postMinLength } = useSettingsContext()
  const [isActive, setActive] = React.useState(props.active || false)
  const [mode, setMode] = React.useState(props.mode || "")
  const [post, setPost] = React.useState<IThreadReplyPost | null>(null)
  const [fullscreen, setFullscreen] = React.useState(false)
  const [minimized, setMinimized] = React.useState(false)

  const ThreadReplySchema = Yup.object().shape({
    markup: Yup.string()
      .required("value_error.missing")
      .min(postMinLength, "value_error.any_str.min_length"),
  })

  const form = useForm<IThreadReplyFormValues>({
    defaultValues: { markup: "" },
    validationSchema: ThreadReplySchema,
  })

  const startReply = React.useCallback(() => {
    setActive(true)
    setMode("reply")
    setPost(null)
    setFullscreen(false)
    setMinimized(false)
  }, [setActive, setMode, setPost, setFullscreen, setMinimized])

  const editReply = React.useCallback(
    (post: IThreadReplyPost) => {
      setActive(true)
      setMode("edit")
      setPost(post)
      setFullscreen(false)
      setMinimized(false)
    },
    [setActive, setMode, setPost, setFullscreen, setMinimized]
  )

  const cancelReply = React.useCallback(() => {
    setActive(false)
    setMode("reply")
    setPost(null)
    form.clearError("markup")
    form.setValue("markup", "")
  }, [setActive, setMode, setPost, form])

  return (
    <ThreadReplyContext.Provider
      value={{
        isActive,
        form,
        fullscreen,
        minimized,
        mode,
        post,
        setFullscreen,
        setMinimized,
        startReply,
        editReply,
        cancelReply,
      }}
    >
      {props.children}
    </ThreadReplyContext.Provider>
  )
}

const useThreadReplyContext = () => React.useContext(ThreadReplyContext)

export { ThreadReplyContext, ThreadReplyProvider, useThreadReplyContext }