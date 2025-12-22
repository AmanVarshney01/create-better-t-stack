{
  description = "create-t-stack devshell flake";

  inputs = {
    nixpkgs = {
      url = "github:NixOS/nixpkgs/nixos-25.11";
    };
  };

  outputs = { self, nixpkgs }:
    let
      mkShellFor = system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        pkgs.mkShell {
          packages = [
            pkgs.bun
            pkgs.nodejs_22
          ];

          shellHook = ''
            if [ -n "$PS1" ]; then
              echo "bun: $(bun --version)"
            fi
          '';
        };
    in
    {
      # explicit nested outputs per system
      devShells.x86_64-linux.default = mkShellFor "x86_64-linux";
      devShells.aarch64-linux.default = mkShellFor "aarch64-linux";
      devShells.x86_64-darwin.default = mkShellFor "x86_64-darwin";
      devShells.aarch64-darwin.default = mkShellFor "aarch64-darwin";
    };
}

