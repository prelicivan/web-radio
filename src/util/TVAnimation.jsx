import { motion, AnimatePresence } from "framer-motion";

function TVAnimation({ isVisible, children }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scaleY: 0,
            transition: { duration: 0.5, ease: "easeInOut" },
          }}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "black",
            color: "white",
          }}
        >
          <motion.div
            initial={{ scaleX: 1 }}
            exit={{
              scaleX: 0,
              transition: { delay: 0.5, duration: 0.5, ease: "easeInOut" },
            }}
            style={{
              width: "100%",
              height: "2px",
              backgroundColor: "white",
            }}
          />
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TVAnimation;