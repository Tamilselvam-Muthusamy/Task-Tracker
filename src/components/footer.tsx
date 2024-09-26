export default function Footer() {
  return (
    <div className="px-4 py-1 flex items-center justify-center w-full  bg-white text-sm tracking-wider fixed bottom-0 right-0">
      <div className="text-center tracking-wider font-medium">
        Copyright © {new Date().getFullYear()} All rights reserved.
      </div>
    </div>
  );
}
