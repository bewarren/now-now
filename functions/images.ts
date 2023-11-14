import { supabase } from "../lib/supabase";

export const loadImages = async (
  id: any,
  handleLoadImages: (load: boolean) => void,
  handleSetImage: (image: string) => void
) => {
  handleLoadImages(true);
  const { data, error } = await supabase.storage
    .from("avatars")
    .download(`${id}.png`);
  if (data) {
    const fr = new FileReader();
    fr.readAsDataURL(data!);
    fr.onload = () => {
      handleSetImage(fr.result as string);
      handleLoadImages(false);
    };
  }

  if (error) {
    handleLoadImages(false);
  } else {
    handleLoadImages(false);
  }
};
