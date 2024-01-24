import { render } from "@testing-library/react";
import { SWRConfig } from "swr";

const AllTheProviders = ({ children }) => {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 0,
        provider: () => new Map(),
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default function customSWRRender(ui, options) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}
