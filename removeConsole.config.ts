// each option is optional, if you don't set it, the default value will be used
// each option takes an array of string
export const removeConsoleConfig = {
  /** The types of console that needs to be removed, such as `log`、`warn`、`error`、`info`, default `log` */
  includes: ["log"],
  /** Don't remove the types of console these modules */
  external: undefined,
  /** Don't remove the log that contains this value */
  externalValue: undefined,
  /** Completely customize the statements that need to be removed, which will overwrite `includes` */
  custom: undefined,
}
