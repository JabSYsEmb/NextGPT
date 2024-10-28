import autoprefixer from "autoprefixer";
import cssnanoPlugin from "cssnano";

const config = {
  plugins: [autoprefixer(), cssnanoPlugin()],
};

export default config;
