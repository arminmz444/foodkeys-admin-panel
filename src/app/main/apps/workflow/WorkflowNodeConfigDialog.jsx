function WorkflowNodeConfigDialog() {
const [scriptType, setScriptType] = useState<'groovy' | 'javascript'>('groovy');
const [scriptCode, setScriptCode] = useState<string>('');

return (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Configure Script Step</DialogTitle>
    <DialogContent>
      <FormControl>
        <InputLabel>Script Type</InputLabel>
        <Select
          value={scriptType}
          onChange={(e) => setScriptType(e.target.value as any)}
        >
          <MenuItem value="groovy">Groovy</MenuItem>
          <MenuItem value="javascript">JavaScript</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Script Code"
        multiline
        rows={6}
        value={scriptCode}
        onChange={(e) => setScriptCode(e.target.value)}
        fullWidth
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={() => handleSave(scriptType, scriptCode)}>
        Save
      </Button>
    </DialogActions>
  </Dialog>
);
}

export default WorkflowNodeConfigDialog;